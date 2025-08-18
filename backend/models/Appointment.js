const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Service provider is required']
  },
  title: {
    type: String,
    required: [true, 'Appointment title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes'],
    max: [480, 'Maximum duration is 8 hours']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  meetingType: {
    type: String,
    enum: ['in-person', 'video-call', 'phone-call'],
    default: 'in-person'
  },
  meetingLink: {
    type: String,
    required: function() { return this.meetingType === 'video-call'; }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  cancelReason: {
    type: String,
    trim: true,
    maxlength: [200, 'Cancel reason cannot exceed 200 characters']
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ provider: 1, date: 1, startTime: 1 });
appointmentSchema.index({ client: 1, date: 1 });
appointmentSchema.index({ status: 1, date: 1 });

// Validate that end time is after start time
appointmentSchema.pre('save', function(next) {
  const startHour = parseInt(this.startTime.split(':')[0]);
  const startMinute = parseInt(this.startTime.split(':')[1]);
  const endHour = parseInt(this.endTime.split(':')[0]);
  const endMinute = parseInt(this.endTime.split(':')[1]);
  
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  if (endTotalMinutes <= startTotalMinutes) {
    return next(new Error('End time must be after start time'));
  }
  
  // Calculate duration automatically
  this.duration = endTotalMinutes - startTotalMinutes;
  next();
});

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('vi-VN');
});

// Virtual for appointment datetime
appointmentSchema.virtual('appointmentDateTime').get(function() {
  const dateStr = this.date.toISOString().split('T')[0];
  return new Date(`${dateStr}T${this.startTime}:00`);
});

module.exports = mongoose.model('Appointment', appointmentSchema);