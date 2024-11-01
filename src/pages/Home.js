import React, { useState } from 'react';
import ForecastCard from '../components/ForecastCard';
import WeatherChart from '../components/WeatherChart';


function Home() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <>
      <div className="forecast-container">
        <ForecastCard data={{ date: "22/08", rain: "0mm" }} />
        <ForecastCard data={{ date: "23/08", rain: "3mm" }} />
        <ForecastCard data={{ date: "24/08", rain: "2mm" }} />
        <ForecastCard data={{ date: "25/08", rain: "0mm", isToday: true }} />
        <div className="arrow">&#8594;</div> 
        <ForecastCard data={{ date: "26/08", rain: "0mm", isTomorrow: true }} />
      </div>
      {/* New Selector for Rainfall, Temperature, Wind Speed and Date Inputs */}
      <div className="weather-selector">
        <select>
          <option>Rainfall</option>
          <option>Temperature</option>
          <option>Wind speed</option>
        </select>
        {/* From and To Date Inputs */}
        <div className="date-inputs">
          <label>From:</label>
          <input 
            type="date" 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)} 
          />
          <label>To:</label>
          <input 
            type="date" 
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)} 
          />
        </div>
      </div>
      <WeatherChart />
    </>
  );
}
export default Home;

