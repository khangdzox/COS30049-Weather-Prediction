import React, { useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherGraph from '../components/WeatherGraph';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Grid2, Stack, Typography, Button, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

const mapNameToLabel = {
  Date: 'Date',
  State: 'State',
  Temp_Min: 'Minimum Temperature (°C)',
  Temp_Max: 'Maximum Temperature (°C)',
  Rain_mm: 'Rainfall (mm)',
  Evaporation_mm: 'Evaporation (mm)',
  Sun_hours: 'Sun Hours',
  Wind_Direction: 'Wind Direction',
  Wind_Speed: 'Wind Speed (km/h)',
  Time_since_midnight: 'Time Since Midnight',
  Temp_9am: 'Temperature at 9am (°C)',
  RH_9am: 'RH at 9am (%)',
  Cld_9am: 'Cloud at 9am',
  Dir_9am: 'Wind Direction at 9am',
  Spd_9am: 'Wind Speed at 9am (km/h)',
  MSLP_9am: 'MSLP at 9am',
  Temp_3pm: 'Temperature at 3pm (°C)',
  RH_3pm: 'RH at 3pm (%)',
  Cld_3pm: 'Cloud at 3pm',
  Dir_3pm: 'Wind Direction at 3pm',
  Spd_3pm: 'Wind Speed at 3pm (km/h)',
  MSLP_3pm: 'MSLP at 3pm',
}

function Home() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weatherType, setWeatherType] = useState('');
  const [formResult, setFormResults] = useState({severity: '', message: ''});
  const [missingFields, setMissingFields] = useState([]);
  const [formData, setFormData] = useState({
    Day: '',
    Month: '',
    Year: '',
    State: '',
    Temp_Min: '',
    Temp_Max: '',
    Rain_mm: '',
    Evaporation_mm: '',
    Sun_hours: '',
    Wind_Direction: '',
    Wind_Speed: '',
    Time_since_midnight: '',
    Temp_9am: '',
    RH_9am: '',
    Cld_9am: '',
    Dir_9am: '',
    Spd_9am: '',
    MSLP_9am: '',
    Temp_3pm: '',
    RH_3pm: '',
    Cld_3pm: '',
    Dir_3pm: '',
    Spd_3pm: '',
    MSLP_3pm: '',
    Temp_Diff: '',
    Rain_Indicator: ''
  });

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;

    // Update form data based on the input field
    setFormData((prevFormData) => {
      let updatedFormData;

      // If name is Date, split the value into Year, Month and Day
      if (name === 'Date') {
        const [year, month, day] = value.split('-');
        updatedFormData = { ...prevFormData, Year: year, Month: month, Day: day };

      // If Wind_Direction or Wind_Speed is set to 0, set both to 0
      // If Wind_Direction or Wind_Speed is set to a value, set both to empty string
      } else if (name === 'Wind_Direction' || name === 'Wind_Speed') {
        if (value === '0') {
          updatedFormData = { ...prevFormData, Wind_Direction: '0', Wind_Speed: '0' };
        } else {
          if (prevFormData.Wind_Direction === '0' || prevFormData.Wind_Speed === '0') {
            updatedFormData = { ...prevFormData, Wind_Direction: '', Wind_Speed: '', [name]: value };
          } else {
            updatedFormData = { ...prevFormData, [name]: value };
          }
        }

      // If Dir_9am or Spd_9am is set to 0, set both to 0
      // If Dir_9am or Spd_9am is set to a value, set both to empty string
      } else if (name === 'Dir_9am' || name === 'Spd_9am') {
        if (value === '0') {
          updatedFormData = { ...prevFormData, Dir_9am: '0', Spd_9am: '0' };
        } else {
          if (prevFormData.Dir_9am === '0' || prevFormData.Spd_9am === '0') {
            updatedFormData = { ...prevFormData, Dir_9am: '', Spd_9am: '', [name]: value };
          } else {
            updatedFormData = { ...prevFormData, Dir_9am: '', Spd_9am: '', [name]: value };
          }
        }

      // If Dir_3pm or Spd_3pm is set to 0, set both to 0
      // If Dir_3pm or Spd_3pm is set to a value, set both to empty string
      } else if (name === 'Dir_3pm' || name === 'Spd_3pm') {
        if (value === '0') {
          updatedFormData = { ...prevFormData, Dir_3pm: '0', Spd_3pm: '0' };
        } else {
          if (prevFormData.Dir_3pm === '0' || prevFormData.Spd_3pm === '0') {
            updatedFormData = { ...prevFormData, Dir_3pm: '', Spd_3pm: '', [name]: value };
          } else {
            updatedFormData = { ...prevFormData, Dir_3pm: '', Spd_3pm: '', [name]: value };
          }
        }

      // Else, update the form data with the new value
      } else {
        updatedFormData = { ...prevFormData, [name]: value };
      }

      // Calculate Temp_Diff based on Temp_Min and Temp_Max
      if (name === 'Temp_Min' || name === 'Temp_Max') {
        if (updatedFormData.Temp_Min !== '' && updatedFormData.Temp_Max !== '') {
          updatedFormData.Temp_Diff = parseFloat(updatedFormData.Temp_Max) - parseFloat(updatedFormData.Temp_Min);
        }

      // Calculate Rain_Indicator based on Rain_mm
      } else if (name === 'Rain_mm') {
        updatedFormData.Rain_Indicator = parseFloat(value) > 0 ? '1' : '0';
      }

      return updatedFormData;
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    let _missingFields = [];

    for (const key in formData) {

      if (formData[key] === '') {

        if ((key === 'Day' || key === 'Month' || key === 'Year') && !_missingFields.includes('Date')) {
          _missingFields.push('Date');
        } else {
          _missingFields.push(key);
        }
      }
    }

    if (_missingFields.length > 0) {
      setFormResults({severity: 'error', message: 'Please fill in the required fields.'});
      setMissingFields(_missingFields);
    } else {
      setFormResults({severity: 'success', message: 'Weather data submitted successfully!'});
      setMissingFields([]);
    }
  }

  const handleFormReset = () => {
    setFormData({
      Day: '',
      Month: '',
      Year: '',
      State: '',
      Temp_Min: '',
      Temp_Max: '',
      Rain_mm: '',
      Evaporation_mm: '',
      Sun_hours: '',
      Wind_Direction: '',
      Wind_Speed: '',
      Time_since_midnight: '',
      Temp_9am: '',
      RH_9am: '',
      Cld_9am: '',
      Dir_9am: '',
      Spd_9am: '',
      MSLP_9am: '',
      Temp_3pm: '',
      RH_3pm: '',
      Cld_3pm: '',
      Dir_3pm: '',
      Spd_3pm: '',
      MSLP_3pm: '',
      Temp_Diff: '',
      Rain_Indicator: ''
    });
    setFormResults({severity: '', message: ''});
    setMissingFields([]);
  }

  const handleWeatherTypeChange = (event) => setWeatherType(event.target.value);

  const handleFromDateChange = (event) => {
    const newFromDate = event.target.value;
    setFromDate(newFromDate);
    if (toDate && newFromDate > toDate) {
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
      <Stack direction='row' spacing={2} sx={{mb: 5}} justifyContent='center'>
        <ForecastCard date="22/08" rain="0" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="23/08" rain="3" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="24/08" rain="2" display={{ xs: 'none', sm: 'none', md: 'block' }} />
        <ForecastCard date="25/08" rain="0" isToday display={{ xs: 'none', sm: 'block' }} />
        <Box sx={{ mx: 2, color: 'teal', fontSize: '2rem', display: { xs: 'none', sm: 'flex' }, alignItems: "center" }}>&#8594;</Box>
        <ForecastCard date="26/08" rain="0" isTomorrow />
      </Stack>

      {/* Responsive Form for Weather Data Inputs */}
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h5" align="left" gutterBottom>Manual Weather Data Inputs</Typography>

        <form noValidate onSubmit={handleFormSubmit} onReset={handleFormReset}>
          <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            {
              Object.entries(mapNameToLabel).map(([name, label]) => {
                if (name === 'Date') {
                  return (
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                      <TextField
                      required
                      error={missingFields.includes('Date')}
                      label={label}
                      type="date"
                      fullWidth
                      name={name}
                      value={
                        (formData.Year && formData.Month && formData.Day) ?
                        `${formData.Year}-${formData.Month}-${formData.Day}` :
                        ''
                      }
                      onChange={handleFormDataChange}
                      slotProps={{
                        inputLabel: { shrink: true }
                      }}
                      size='small'
                      />
                    </Grid2>
                  )
                } else if (name === 'State') {
                  return (
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                      <FormControl
                      variant="outlined"
                      fullWidth size='small'
                      required
                      error={missingFields.includes(name)}
                      >
                        <InputLabel>{label}</InputLabel>
                        <Select
                        name={name}
                        value={formData[name]}
                        onChange={handleFormDataChange}
                        label={label}
                        sx={{ textAlign: 'left' }}
                        >
                          <MenuItem value="VIC">Victoria</MenuItem>
                          <MenuItem value="NSW">New South Wales</MenuItem>
                          <MenuItem value="QLD">Queensland</MenuItem>
                          <MenuItem value="SA">South Australia</MenuItem>
                          <MenuItem value="WA">Western Australia</MenuItem>
                          <MenuItem value="TAS">Tasmania</MenuItem>
                          <MenuItem value="NT">Northern Territory</MenuItem>
                          <MenuItem value="ACT">Australian Capital Territory</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid2>
                  )
                } else if (name === 'Wind_Direction' || name === 'Dir_9am' || name === 'Dir_3pm') {
                  return (
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                    <FormControl
                    variant="outlined"
                    fullWidth size='small'
                    required
                    error={missingFields.includes(name)}
                    >
                      <InputLabel>{label}</InputLabel>
                      <Select
                      name={name}
                      value={formData[name]}
                      onChange={handleFormDataChange}
                      label={label}
                      sx={{ textAlign: 'left' }}
                      >
                        <MenuItem value="0">No wind</MenuItem>
                        <MenuItem value="1">North</MenuItem>
                        <MenuItem value="2">North North-East</MenuItem>
                        <MenuItem value="3">North-East</MenuItem>
                        <MenuItem value="4">East North-East</MenuItem>
                        <MenuItem value="5">East</MenuItem>
                        <MenuItem value="6">East South-East</MenuItem>
                        <MenuItem value="7">South-East</MenuItem>
                        <MenuItem value="8">South South-East</MenuItem>
                        <MenuItem value="9">South</MenuItem>
                        <MenuItem value="10">South South-West</MenuItem>
                        <MenuItem value="11">South-West</MenuItem>
                        <MenuItem value="12">West South-West</MenuItem>
                        <MenuItem value="13">West</MenuItem>
                        <MenuItem value="14">West North-West</MenuItem>
                        <MenuItem value="15">North-West</MenuItem>
                        <MenuItem value="16">North North-West</MenuItem>
                      </Select>
                    </FormControl>
                    </Grid2>
                  )
                } else {
                  return (
                    <Grid2 size={{ xs: 12, sm: 4 }} key={name}>
                      <TextField
                      required
                      error={missingFields.includes(name)}
                      label={label}
                      type="number"
                      fullWidth
                      name={name}
                      value={formData[name]}
                      onChange={handleFormDataChange}
                      size='small'
                      />
                    </Grid2>
                  )
                }
              })
            }

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Button
              variant="contained"
              color="primary"
              fullWidth
              type='submit'
              size='large'
              startIcon={<SaveIcon />}
              >
                Submit
              </Button>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Button
              variant="contained"
              color="error"
              fullWidth
              type='reset'
              size='large'
              startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Grid2>
          </Grid2>
        </form>

        {formResult.message && <Alert severity={formResult.severity}>{formResult.message}</Alert>}
      </Box>

      {/* New Selector for Rainfall, Temperature, Wind Speed and Date Inputs */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" align="left" gutterBottom>Weather Data Chart</Typography>

        <Grid2 container spacing={2} alignItems="center" justifyContent="center">
          <Grid2 size={{ xs: 12, sm: 4}} >
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Weather Type</InputLabel>
              <Select
              value={weatherType}
              onChange={handleWeatherTypeChange}
              label="Weather Type"
              sx={{ textAlign: 'left' }}
              >
                <MenuItem value="Rain_mm">Rainfall (mm)</MenuItem>
                <MenuItem value="Temp_Min">Minimum Temperature (°C)</MenuItem>
                <MenuItem value="Temp_Max">Maximum Temperature (°C)</MenuItem>
                <MenuItem value="Evaporation_mm">Evaporation (mm)</MenuItem>
                <MenuItem value="Wind_Speed">Maximum Wind Speed (km/h)</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4}} >
            <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: new Date().toISOString().split('T')[0] }
            }}
            fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4}} >
            <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: fromDate, max: new Date().toISOString().split('T')[0]}
            }}
            fullWidth
            />
          </Grid2>
        </Grid2>

        {/* Weather Chart */}
        <WeatherGraph weatherType={weatherType} fromDate={fromDate} toDate={toDate} />
      </Box>

    </>
  );
}

export default Home;
