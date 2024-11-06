import React, { useEffect, useState } from 'react';
import AusMap from '../components/AusMap';
import * as d3 from 'd3';
import { Typography, FormControl, Select, MenuItem, Stack, TextField, InputLabel } from '@mui/material';

// Define the mapping of weather types to their respective configurations
const mapNameToConfig = {
  'Rain_mm': {
    displayName: 'Rainfall (mm)',
    colorInterpolate: d3.interpolateBlues,
    domain: [0, 200]
  },
  'Temp_Max': {
    displayName: 'Maximum Temperature (°C)',
    colorInterpolate: d3.interpolateRgbBasis(['white', 'yellow', 'red']),
    domain: [-10, 50],
  },
  'Temp_Min': {
    displayName: 'Minimum Temperature (°C)',
    colorInterpolate: d3.interpolateRgbBasis(['white', 'yellow', 'red']),
    domain: [-10, 50],
  },
}

const ausStates = [ 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT' ];

const Map = () => {
  const [weatherType, setWeatherType] = useState('Rain_mm');
  const [date, setDate] = useState('2023-08-01');
  const [data, setData] = useState([]);

  // Fetch weather data for each state
  useEffect(() => {
    setData([
      { 'State': 'NSW', [weatherType]: 0 },
      { 'State': 'VIC', [weatherType]: 0 },
      { 'State': 'QLD', [weatherType]: 0 },
      { 'State': 'SA', [weatherType]: 0 },
      { 'State': 'WA', [weatherType]: 0 },
      { 'State': 'TAS', [weatherType]: 0 },
      { 'State': 'NT', [weatherType]: 0 },
      { 'State': 'ACT', [weatherType]: 0 },
    ]);

    for (const state of ausStates) {
      fetch(`http://localhost:8000/api/data/weather?state=${state}&weatherType=${weatherType}&fromDate=${date}&toDate=${date}`)
      .then(res => res.json())
      .then(res => {
        setData(data => data.map(d => {
          if (d['State'] === state) {
            return { 'State': state, [weatherType]: res[0][weatherType] };
          }
          return d;
        }));
      });
    }

  }, [weatherType, date]);

  return (
    <>
      <Typography variant='h4' gutterBottom>
        Map of Australia
      </Typography>

      {/* Date and Weather Type selection */}
      <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Select Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: '2023-08-01', max: '2024-09-23' }
          }}
          fullWidth
        />

        <FormControl variant='outlined' fullWidth>
          <InputLabel>Weather Type</InputLabel>
          <Select
            label='Weather Type'
            value={weatherType}
            onChange={e => setWeatherType(e.target.value)}
          >
            <MenuItem value='Rain_mm'>Rainfall (mm)</MenuItem>
            <MenuItem value='Temp_Max'>Maximum Temperature (°C)</MenuItem>
            <MenuItem value='Temp_Min'>Minimum Temperature (°C)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Display the map */}
      <AusMap
      data={data}
      dataName={weatherType}
      displayName={mapNameToConfig[weatherType].displayName}
      colorInterpolate={mapNameToConfig[weatherType].colorInterpolate}
      domain={mapNameToConfig[weatherType].domain}/>
    </>
  );
};

export default Map;
