import { Paper } from '@mui/material';
import WeatherBarGraph from './WeatherBarGraph';
import WeatherLineGraph from './WeatherLineGraph';
import WeatherMissingValues from './WeatherMissingValues';

const mapWeatherTypeToGraphType = (weatherType) => {
    if (['Rain_mm', 'Evaporation_mm', 'Wind_Speed'].includes(weatherType)) {
      return 'bar';
    } else {
      return 'line';
    }
  }

const WeatherGraph = ({weatherType, toDate, fromDate}) => {
  return (
    <Paper elevation={3} sx={{ m: 2, p: 2 }}>
      {!weatherType || !toDate || !fromDate ? (
        <WeatherMissingValues />
      ) : mapWeatherTypeToGraphType(weatherType) === 'line' ? (
        <WeatherLineGraph fromDate={fromDate} toDate={toDate} dataType={weatherType} />
      ) : (
        <WeatherBarGraph fromDate={fromDate} toDate={toDate} dataType={weatherType} />
      )}
    </Paper>
  );
}

export default WeatherGraph;