import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Home = () => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate('/simple-booking');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <CalendarTodayIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Hệ thống Đặt lịch hẹn
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Đặt lịch hẹn nhanh chóng và tiện lợi
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            Chào mừng bạn đến với hệ thống đặt lịch hẹn trực tuyến.
            Bạn có thể dễ dàng đặt lịch hẹn chỉ với vài cú click.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⏰ Giờ hoạt động: 7:00 - 19:00 hàng ngày
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleBookingClick}
          startIcon={<CalendarTodayIcon />}
          sx={{
            py: 2,
            px: 4,
            fontSize: '1.2rem',
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Đặt lịch hẹn ngay
        </Button>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary">
            Cần hỗ trợ? Liên hệ: <strong>0123-456-789</strong>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;