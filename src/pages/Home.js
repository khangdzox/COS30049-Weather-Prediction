import React, { useState, useEffect } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherChart from '../components/WeatherChart';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel } from '@mui/material';

function Home() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weatherType, setWeatherType] = useState('Rainfall');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Update screen size state on resize
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1050);
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWeatherTypeChange = (event) => setWeatherType(event.target.value);

  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
    setFromDate(newFromDate);
    if (newFromDate > toDate) {
      setToDate(newFromDate);
    }
  };

  const handleToDateChange = (event) => {
    const newToDate = event.target.value;
    if (newToDate >= fromDate) {
      setToDate(newToDate);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
  {/* Conditionally render cards based on screen size */}
  {isSmallScreen ? (
    <>
      {/* Show only the last two cards on smaller screens */}
      <ForecastCard data={{ date: "25/08", rain: "0mm", isToday: true }} />
      <Box sx={{ mx: 2, fontSize: '2rem' }}>&#8594;</Box>
      <ForecastCard data={{ date: "26/08", rain: "0mm", isTomorrow: true }} />
    </>
  ) : (
    <>
      {/* Show all cards on larger screens */}
      <ForecastCard data={{ date: "22/08", rain: "0mm" }} />
      <ForecastCard data={{ date: "23/08", rain: "3mm" }} />
      <ForecastCard data={{ date: "24/08", rain: "2mm" }} />
      <ForecastCard data={{ date: "25/08", rain: "0mm", isToday: true }} />
      <Box sx={{ mx: 2, fontSize: '2rem' }}>&#8594;</Box>
      <ForecastCard data={{ date: "26/08", rain: "0mm", isTomorrow: true }} />
    </>
  )}
</Box>

      {/* New Selector for Rainfall, Temperature, Wind Speed and Date Inputs */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 150, mr: 2 }}>
          <InputLabel>Weather Type</InputLabel>
          <Select
            value={weatherType}
            onChange={handleWeatherTypeChange}
            label="Weather Type"
          >
            <MenuItem value="Rainfall">Rainfall</MenuItem>
            <MenuItem value="Temperature">Temperature</MenuItem>
            <MenuItem value="Wind speed">Wind speed</MenuItem>
          </Select>
        </FormControl>

        {/* From and To Date Inputs */}
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
          sx={{ mr: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={handleToDateChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: fromDate }}
        />
      </Box>

      {/* Weather Chart */}
      <WeatherChart fromDate={fromDate} toDate={toDate} weatherType={weatherType} />
    </>
  );
}

export default Home;
