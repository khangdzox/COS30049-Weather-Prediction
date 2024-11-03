import { Box, Typography } from '@mui/material';
import React from 'react';

const FAQ = () => {
  return (
    <Box style={{ backgroundColor: '#b3d9ff', padding: '20px', textAlign: 'left' }}>
      <Typography variant='h2' gutterBottom align='center'>Frequently Asked Questions (FAQ)</Typography>

      <Typography variant='h4'>How to set the date?</Typography>
      <Typography variant='body1' gutterBottom>To set the date range for the weather data, use the "From Date" and "To Date" fields. Click on each field, select the desired date from the calendar pop-up, or type in the date directly in the format <code>mm/dd/yyyy</code>.</Typography>

      <Typography variant='h4'>How to apply filters?</Typography>
      <Typography variant='body1' gutterBottom>You can filter the data by selecting a specific "Weather Type" from the dropdown menu. Options include "Rainfall," "Temperature," and "Wind Speed." Once selected, the graphs and forecasts will adjust to reflect your chosen filter.</Typography>

      <Typography variant='h4'>What is the maximum date range I can select?</Typography>
      <Typography variant='body1' gutterBottom>The maximum date range depends on the data available in our system. Generally, the range is limited to recent dates to ensure accurate and relevant predictions. If you select a range that exceeds the available data, the graphs may not display complete information.</Typography>

      <Typography variant='h4'>What cities can I select for the forecast?</Typography>
      <Typography variant='body1' gutterBottom>The current cities available for selection are Melbourne, Sydney, Brisbane, Perth, Adelaide, Canberra, Hobart, and Darwin. Simply choose your preferred location from the "City" dropdown to view weather data specific to that area.</Typography>

      <Typography variant='h4'>What weather types can I select?</Typography>
      <Typography variant='body1' gutterBottom>The app allows you to view data for "Rainfall," "Temperature," and "Wind Speed." Each option provides a different perspective, allowing you to examine weather patterns in terms of precipitation, temperature variations, or wind conditions.</Typography>

      <Typography variant='h4'>How do I interpret the graph data?</Typography>
      <Typography variant='body1' gutterBottom>The line and bar charts display historical weather data for the selected date range and weather type. For example, if you choose "Rainfall," the graph will show daily or monthly rainfall amounts, allowing you to visualize precipitation patterns over time.</Typography>

      <Typography variant='h4'>How does the AI model work behind the scenes?</Typography>
      <Typography variant='body1' gutterBottom>The AI model uses historical weather data to make predictions. It analyzes patterns and trends over time, learning from past conditions to forecast future weather. This model adapts to new data and can provide increasingly accurate predictions as more information becomes available.</Typography>
    </Box>
  );
};

export default FAQ;
