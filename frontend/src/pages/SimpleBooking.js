import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { format, isToday, isFuture } from 'date-fns';

const SimpleBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch appointments for selected date
  const fetchAppointments = async (date) => {
    setLoading(true);
    setError('');
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments?date=${formattedDate}`);
      setAppointments(response.data.slots || []);
    } catch (err) {
      setError('Không thể tải dữ liệu lịch hẹn');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Book appointment
  const handleBookAppointment = async () => {
    if (!clientName.trim()) {
      setError('Vui lòng nhập tên khách hàng');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/appointments`, {
        date: formattedDate,
        startTime: selectedSlot,
        clientName: clientName.trim(),
        description: description.trim()
      });
      
      setSuccess('Đặt lịch thành công!');
      setBookingDialog(false);
      setClientName('');
      setDescription('');
      setSelectedSlot('');
      fetchAppointments(selectedDate);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/appointments/${appointmentId}`);
      setSuccess('Hủy lịch thành công!');
      fetchAppointments(selectedDate);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể hủy lịch');
    } finally {
      setLoading(false);
    }
  };

  // Open booking dialog
  const openBookingDialog = (time) => {
    setSelectedSlot(time);
    setBookingDialog(true);
    setError('');
  };

  // Close booking dialog
  const closeBookingDialog = () => {
    setBookingDialog(false);
    setSelectedSlot('');
    setClientName('');
    setDescription('');
    setError('');
  };

  // Load appointments when date changes
  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Hệ Thống Đặt Lịch Hẹn
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Chọn ngày và khung giờ phù hợp để đặt lịch hẹn
        </Typography>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Date Picker */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Chọn Ngày
          </Typography>
          <DatePicker
            label="Chọn ngày"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            minDate={new Date()}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Paper>

        {/* Time Slots */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Khung Giờ Có Sẵn - {format(selectedDate, 'dd/MM/yyyy')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Giờ hoạt động: 7:00 - 19:00 (mỗi slot 30 phút)
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography>Đang tải...</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {appointments.map((slot, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: slot.available ? 'pointer' : 'default',
                      bgcolor: slot.available ? 'background.paper' : 'grey.100',
                      '&:hover': slot.available ? {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      } : {}
                    }}
                    onClick={() => slot.available && openBookingDialog(slot.time)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h6" component="div">
                        {slot.time}
                      </Typography>
                      {slot.available ? (
                        <Chip 
                          label="Còn trống" 
                          color="success" 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      ) : (
                        <Box>
                          <Chip 
                            label="Đã đặt" 
                            color="error" 
                            size="small" 
                            sx={{ mt: 1, mb: 1 }}
                          />
                          {slot.appointment && (
                            <Box>
                              <Typography variant="caption" display="block">
                                {slot.appointment.clientName}
                              </Typography>
                              <Button
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelAppointment(slot.appointment.id);
                                }}
                                sx={{ mt: 1 }}
                              >
                                Hủy
                              </Button>
                            </Box>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Booking Dialog */}
        <Dialog open={bookingDialog} onClose={closeBookingDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Đặt Lịch Hẹn - {selectedSlot}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Mô tả (tùy chọn)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Ngày: {format(selectedDate, 'dd/MM/yyyy')}<br/>
                Thời gian: {selectedSlot} - {selectedSlot && 
                  format(new Date(`2000-01-01 ${selectedSlot}`).getTime() + 30 * 60000, 'HH:mm')
                }
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeBookingDialog}>Hủy</Button>
            <Button 
              onClick={handleBookAppointment} 
              variant="contained"
              disabled={loading || !clientName.trim()}
            >
              {loading ? 'Đang đặt...' : 'Đặt Lịch'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default SimpleBooking;