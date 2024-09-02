// components/LoadingScreen.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a2e', // Dark blue background
        color: 'white',
      }}
    >
      <img src="/icons/kBULB-01.svg" alt="Logo" style={{ marginBottom: '30px', width: '100px' }} />
      <Typography variant="body1" sx={{ marginBottom: '20px' }}>
        Kleesia, a platform to share, discuss, and learn about the latest scientific research. 
      </Typography>
      <CircularProgress color="primary" />
      <Typography variant="body2" sx={{ marginTop: '10px' }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
