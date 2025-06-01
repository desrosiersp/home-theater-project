import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function HomePage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Home Theater Planner
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Design, Plan, and Optimize Your Dream Home Theater
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This is the future home of an amazing home theater planning experience.
          Explore our tools and guides to build the perfect setup.
        </Typography>
        <RouterLink to="/planner" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" color="primary">
            Go to the Planner Tool
          </Typography>
        </RouterLink>
      </Box>
    </Container>
  );
}

export default HomePage;
