import React from 'react';
import { Box, Typography } from '@mui/material';

const WeatherMissingValues = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: '870/440',
      }}
    >
      <Typography variant="h6">
        Missing value for weather
      </Typography>
    </Box>
  );
};

export default WeatherMissingValues;