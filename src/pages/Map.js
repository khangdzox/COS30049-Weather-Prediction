import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AusMap from '../components/AusMap';

const Map = () => {
  const [location, setLocation] = useOutletContext();
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch('https://api.weather.gov.au/rainfall')
    //   .then(response => response.json())
    //   .then(data => setData(data));

    // Mock data
    setData([
      { 'State': 'NSW', 'Temp_Max': 20 },
      { 'State': 'VIC', 'Temp_Max': 30 },
      { 'State': 'QLD', 'Temp_Max': 40 },
      { 'State': 'SA', 'Temp_Max': 50 },
      { 'State': 'WA', 'Temp_Max': 60 },
      { 'State': 'TAS', 'Temp_Max': 70 },
      { 'State': 'NT', 'Temp_Max': 80 },
      { 'State': 'ACT', 'Temp_Max': 90 },
    ]);
  }, []);

  return (
    <AusMap data={data} dataName='Temp_Max' displayName='Maximum Temperature (°C)' />
  );
};

export default Map;
