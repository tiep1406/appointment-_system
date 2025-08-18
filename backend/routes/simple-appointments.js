const express = require('express');
const { body, validationResult, query } = require('express-validator');
const moment = require('moment');

const router = express.Router();

// In-memory storage for simplicity (as per requirements)
let appointments = [];
let appointmentIdCounter = 1;

// Helper function to generate time slots (7AM - 7PM, 30-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour < 19; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

// Helper function to check if cancellation is allowed (30 minutes before)
const canCancelAppointment = (appointment) => {
  const appointmentDateTime = moment(`${appointment.date} ${appointment.startTime}`);
  const now = moment();
  return appointmentDateTime.diff(now, 'minutes') >= 30;
};

// @route   GET /api/appointments?date=YYYY-MM-DD
// @desc    Get all appointments for a specific date
// @access  Public (simplified for test)
router.get('/', [
  query('date').isISO8601().withMessage('Date must be in YYYY-MM-DD format')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const requestedDate = req.query.date;
    if (!requestedDate) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Get all time slots
    const allSlots = generateTimeSlots();
    
    // Get booked appointments for the date
    const bookedAppointments = appointments.filter(apt => apt.date === requestedDate);
    
    // Create response with slot availability
    const slots = allSlots.map(time => {
      const bookedAppointment = bookedAppointments.find(apt => apt.startTime === time);
      return {
        time,
        available: !bookedAppointment,
        appointment: bookedAppointment || null
      };
    });

    res.json({
      date: requestedDate,
      slots,
      totalSlots: allSlots.length,
      availableSlots: slots.filter(slot => slot.available).length,
      bookedSlots: slots.filter(slot => !slot.available).length
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Public (simplified for test)
router.post('/', [
  body('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM)'),
  body('clientName').trim().isLength({ min: 1, max: 100 }).withMessage('Client name is required and must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { date, startTime, clientName, description } = req.body;

    // Validate date is not in the past
    const appointmentDate = moment(date);
    if (appointmentDate.isBefore(moment(), 'day')) {
      return res.status(400).json({ message: 'Cannot book appointments in the past' });
    }

    // Validate time slot is within working hours (7AM - 7PM)
    const allSlots = generateTimeSlots();
    if (!allSlots.includes(startTime)) {
      return res.status(400).json({ 
        message: 'Invalid time slot. Available slots are from 07:00 to 18:30 in 30-minute intervals' 
      });
    }

    // Check if slot is already booked
    const existingAppointment = appointments.find(
      apt => apt.date === date && apt.startTime === startTime
    );

    if (existingAppointment) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    // Calculate end time (30 minutes later)
    const startMoment = moment(startTime, 'HH:mm');
    const endTime = startMoment.add(30, 'minutes').format('HH:mm');

    // Create new appointment
    const newAppointment = {
      id: appointmentIdCounter++,
      date,
      startTime,
      endTime,
      clientName,
      description: description || '',
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel an appointment
// @access  Public (simplified for test)
router.delete('/:id', (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    
    if (isNaN(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const appointment = appointments[appointmentIndex];

    // Check if cancellation is allowed (30 minutes before)
    if (!canCancelAppointment(appointment)) {
      return res.status(400).json({ 
        message: 'Cannot cancel appointment. Cancellation must be done at least 30 minutes before the appointment time' 
      });
    }

    // Remove appointment
    appointments.splice(appointmentIndex, 1);

    res.json({
      message: 'Appointment cancelled successfully',
      cancelledAppointment: appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments/slots?date=YYYY-MM-DD
// @desc    Get available time slots for a specific date
// @access  Public
router.get('/slots', [
  query('date').isISO8601().withMessage('Date must be in YYYY-MM-DD format')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const requestedDate = req.query.date;
    if (!requestedDate) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const allSlots = generateTimeSlots();
    const bookedSlots = appointments
      .filter(apt => apt.date === requestedDate)
      .map(apt => apt.startTime);
    
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      date: requestedDate,
      availableSlots,
      bookedSlots,
      totalSlots: allSlots.length
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;