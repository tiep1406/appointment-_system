const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, providerAuth, clientAuth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get appointments (filtered by user role)
// @access  Private
router.get('/', [
  auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']),
  query('date').optional().isISO8601().withMessage('Date must be in ISO format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    if (req.user.role === 'client') {
      query.client = req.user.id;
    } else if (req.user.role === 'provider') {
      query.provider = req.user.id;
    }
    // Admin can see all appointments

    // Add filters
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (req.query.provider && req.user.role === 'admin') {
      query.provider = req.query.provider;
    }

    const appointments = await Appointment.find(query)
      .populate('client', 'name email phone')
      .populate('provider', 'name email phone specialization')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('provider', 'name email phone specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to view this appointment
    if (req.user.role !== 'admin' && 
        appointment.client._id.toString() !== req.user.id && 
        appointment.provider._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error while fetching appointment' });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private (Client)
router.post('/', [
  auth,
  body('provider').isMongoId().withMessage('Valid provider ID is required'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required (HH:MM)'),
  body('meetingType').optional().isIn(['in-person', 'video-call', 'phone-call']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { provider, title, description, date, startTime, endTime, meetingType, location, notes, priority } = req.body;

    // Verify provider exists and is active
    const providerUser = await User.findById(provider);
    if (!providerUser || providerUser.role !== 'provider' || !providerUser.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive provider' });
    }

    // Check if appointment date is in the future
    const appointmentDate = new Date(date);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      provider,
      date: appointmentDate,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      client: req.user.id,
      provider,
      title,
      description,
      date: appointmentDate,
      startTime,
      endTime,
      meetingType: meetingType || 'in-person',
      location,
      notes,
      priority: priority || 'medium'
    });

    await appointment.save();
    
    // Populate the appointment before sending response
    await appointment.populate('client', 'name email phone');
    await appointment.populate('provider', 'name email phone specialization');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error while creating appointment' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('date').optional().isISO8601(),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']),
  body('meetingType').optional().isIn(['in-person', 'video-call', 'phone-call']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    const canEdit = req.user.role === 'admin' || 
                   appointment.client.toString() === req.user.id || 
                   appointment.provider.toString() === req.user.id;
    
    if (!canEdit) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prevent editing completed or cancelled appointments (except by admin)
    if (req.user.role !== 'admin' && ['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ message: 'Cannot edit completed or cancelled appointments' });
    }

    const updateData = req.body;
    
    // If updating date/time, check for conflicts
    if (updateData.date || updateData.startTime || updateData.endTime) {
      const checkDate = updateData.date ? new Date(updateData.date) : appointment.date;
      const checkStartTime = updateData.startTime || appointment.startTime;
      const checkEndTime = updateData.endTime || appointment.endTime;

      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: appointment._id },
        provider: appointment.provider,
        date: checkDate,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { startTime: { $lt: checkEndTime }, endTime: { $gt: checkStartTime } }
        ]
      });

      if (conflictingAppointment) {
        return res.status(400).json({ message: 'Time slot conflicts with existing appointment' });
      }
    }

    // Handle cancellation
    if (updateData.status === 'cancelled') {
      updateData.cancelledBy = req.user.id;
      updateData.cancelledAt = new Date();
      if (req.body.cancelReason) {
        updateData.cancelReason = req.body.cancelReason;
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name email phone')
     .populate('provider', 'name email phone specialization');

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error while updating appointment' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error while deleting appointment' });
  }
});

// @route   GET /api/appointments/provider/:providerId/availability
// @desc    Get provider availability for a specific date
// @access  Public
router.get('/provider/:providerId/availability', [
  query('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { providerId } = req.params;
    const { date } = req.query;

    // Verify provider exists
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== 'provider') {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const checkDate = new Date(date);
    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if provider works on this day
    if (!provider.workingDays.includes(dayName)) {
      return res.json({ available: false, reason: 'Provider does not work on this day' });
    }

    // Get existing appointments for this date
    const appointments = await Appointment.find({
      provider: providerId,
      date: checkDate,
      status: { $in: ['pending', 'confirmed'] }
    }).select('startTime endTime');

    // Generate available time slots
    const workingStart = provider.workingHours.start;
    const workingEnd = provider.workingHours.end;
    const bookedSlots = appointments.map(apt => ({ start: apt.startTime, end: apt.endTime }));

    res.json({
      available: true,
      workingHours: { start: workingStart, end: workingEnd },
      bookedSlots,
      provider: {
        name: provider.name,
        specialization: provider.specialization
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error while checking availability' });
  }
});

module.exports = router;