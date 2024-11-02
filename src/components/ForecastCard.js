import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const getWeatherIcon = (rain) => {
  if (rain < 1) {
    return '☀️';
  } else if (rain < 5) {
    return '🌦️';
  } else {
    return '🌧️';
  }
}

const ForecastCard = ({ date, rain, isToday, isTomorrow, display }) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(0deg, lightblue, white)',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        width: '150px',
        border: isToday ? '2px solid blue' : isTomorrow ? '2px solid green' : '1px solid grey',
        display: display,
      }}
    >
      <CardContent
        sx={{
          pt: '40px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ mb: 2, fontSize: '3rem' }}>
            {getWeatherIcon(rain)} {/* Placeholder Icon */}
          </Box>
          <Typography variant="body2">{isToday ? "Today" : isTomorrow ? "Tomorrow" : "\u00A0"}</Typography>
          <Typography variant="h6">{date}</Typography>
          <Typography variant="body2">Rain: {rain}mm</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;