import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';

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
      <Image
        src="/icons/kBULB-01.svg"
        alt="Logo"
        width={150}  
        height={150} 
        style={{ marginBottom: '40px' }} 
      />
      <Typography variant="h5" sx={{ marginBottom: '30px', textAlign: 'center', maxWidth: '80%' }}>
        A meeting place to share, discuss, and learn about the latest scientific research. 
      </Typography>
      <CircularProgress color="primary" size={60} /> 
      <Typography variant="h6" sx={{ marginTop: '20px' }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
