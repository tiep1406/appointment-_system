import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Event as EventIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Hệ thống đặt lịch hẹn
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
          >
            Đặt lịch hẹn dễ dàng và nhanh chóng với hệ thống quản lý lịch hẹn hiện đại
          </Typography>
          <Button
            component={Link}
            to="/simple-booking"
            variant="contained"
            size="large"
            startIcon={<EventIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Đặt lịch ngay
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Tính năng chính
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              maxWidth: 400,
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <EventIcon 
                sx={{ 
                  fontSize: 60, 
                  color: 'primary.main', 
                  mb: 2 
                }} 
              />
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Đặt lịch đơn giản
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Giao diện thân thiện, dễ sử dụng. Chọn ngày, giờ và đặt lịch chỉ trong vài bước đơn giản.
              </Typography>
              <Button
                component={Link}
                to="/simple-booking"
                variant="outlined"
                startIcon={<EventIcon />}
                sx={{ mt: 2 }}
              >
                Thử ngay
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;