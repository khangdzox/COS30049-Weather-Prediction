import React from 'react';

const ForecastCard = ({ data }) => {
  return (
    <div className={`forecast-card ${data.isToday ? 'today' : ''} ${data.isTomorrow ? 'tomorrow' : ''}`}>
      <div className="placeholder-icon">[Placeholder Icon]</div>
      <p>{data.date}</p>
      <p>Rain: {data.rain}</p>
    </div>
  );
};

export default ForecastCard;