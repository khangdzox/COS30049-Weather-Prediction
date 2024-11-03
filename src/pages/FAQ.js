import React from 'react';

const FAQ = () => {
  return (
    <div style={{ backgroundColor: '#b3d9ff', padding: '20px', textAlign: 'left' }}>
      <h2>Frequently Asked Questions (FAQ)</h2>

      <h3>How to set the date?</h3>
      <p>To set the date range for the weather data, use the "From Date" and "To Date" fields. Click on each field, select the desired date from the calendar pop-up, or type in the date directly in the format <code>mm/dd/yyyy</code>.</p>

      <h3>How to apply filters?</h3>
      <p>You can filter the data by selecting a specific "Weather Type" from the dropdown menu. Options include "Rainfall," "Temperature," and "Wind Speed." Once selected, the graphs and forecasts will adjust to reflect your chosen filter.</p>

      <h3>What is the maximum date range I can select?</h3>
      <p>The maximum date range depends on the data available in our system. Generally, the range is limited to recent dates to ensure accurate and relevant predictions. If you select a range that exceeds the available data, the graphs may not display complete information.</p>

      <h3>What cities can I select for the forecast?</h3>
      <p>The current cities available for selection are Melbourne, Sydney, Brisbane, Perth, Adelaide, Canberra, Hobart, and Darwin. Simply choose your preferred location from the "City" dropdown to view weather data specific to that area.</p>

      <h3>What weather types can I select?</h3>
      <p>The app allows you to view data for "Rainfall," "Temperature," and "Wind Speed." Each option provides a different perspective, allowing you to examine weather patterns in terms of precipitation, temperature variations, or wind conditions.</p>

      <h3>How do I interpret the graph data?</h3>
      <p>The line and bar charts display historical weather data for the selected date range and weather type. For example, if you choose "Rainfall," the graph will show daily or monthly rainfall amounts, allowing you to visualize precipitation patterns over time.</p>

      <h3>How does the AI model work behind the scenes?</h3>
      <p>The AI model uses historical weather data to make predictions. It analyzes patterns and trends over time, learning from past conditions to forecast future weather. This model adapts to new data and can provide increasingly accurate predictions as more information becomes available.</p>
    </div>
  );
};

export default FAQ;
