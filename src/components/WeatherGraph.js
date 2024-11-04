import { Paper, Alert } from '@mui/material';
import WeatherBarGraph from './WeatherBarGraph';
import WeatherLineGraph from './WeatherLineGraph';

const mapWeatherTypeToGraphType = (weatherType) => {
    if (['Rain_mm', 'Evaporation_mm', 'Wind_Speed'].includes(weatherType)) {
      return 'bar';
    } else {
      return 'line';
    }
  }

const WeatherGraph = ({weatherType, toDate, fromDate}) => {
  return (
    <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2 }}>
      {!weatherType || !toDate || !fromDate ? (
        <Alert severity="info">Please select a weather type, from date and to date to display the graph</Alert>
      ) : mapWeatherTypeToGraphType(weatherType) === 'line' ? (
        <WeatherLineGraph fromDate={fromDate} toDate={toDate} dataType={weatherType} />
      ) : (
        <WeatherBarGraph fromDate={fromDate} toDate={toDate} dataType={weatherType} />
      )}
    </Paper>
  );
}

export default WeatherGraph;