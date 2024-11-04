import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const WeatherVisitorScatterGraph = ({ firstCol, secondCol, fromDate, toDate }) => {
  const [firstData, setFirstData] = useState([]);
  const [secondData, setSecondData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // fetch(`http://localhost:3000/data/visitor?column=${firstData}&from=${fromDate}&to=${toDate}`)
    // .then(response => response.json())
    // .then(data => setFirstData(data))
    // .catch(error => console.error('Error fetching data:', error));

    // fetch(`http://localhost:3000/data/visitor?column=${secondData}&from=${fromDate}&to=${toDate}`)
    // .then(response => response.json())
    // .then(data => setSecondData(data))
    // .catch(error => console.error('Error fetching data:', error));

    setFirstData([
      {date: '2020-01', value: 41.2},
      {date: '2020-02', value: 34.6},
      {date: '2020-03', value: 24.6},
      {date: '2020-04', value: 39.6},
      {date: '2020-05', value: 78.4},
      {date: '2020-06', value: 27.6},
      {date: '2020-07', value: 35},
      {date: '2020-08', value: 31},
      {date: '2020-09', value: 65.2},
      {date: '2020-10', value: 124.4},
      {date: '2020-11', value: 38.2},
      {date: '2020-12', value: 18.4},
    ]);

    setSecondData([
      {date: '2020-01', value: 60170},
      {date: '2020-02', value: 70240},
      {date: '2020-03', value: 70440},
      {date: '2020-04', value: 57450},
      {date: '2020-05', value: 44090},
      {date: '2020-06', value: 44130},
      {date: '2020-07', value: 60560},
      {date: '2020-08', value: 54180},
      {date: '2020-09', value: 47200},
      {date: '2020-10', value: 69020},
      {date: '2020-11', value: 78130},
      {date: '2020-12', value: 89380},
    ]);

  }, [firstCol, secondCol, fromDate, toDate]);

  useEffect(() => {
    if (firstData.length === 0 || secondData.length === 0) return;

    const data = firstData.map((d, i) => ({ date: d.date, first: d.value, second: secondData[i].value }));

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Define the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content
    svg.attr('viewBox', [0, 0, width, height]);

    // Create the horizontal scale
    const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.first))
    .nice()
    .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(x);

    // Create the vertical scale
    const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.second))
    .nice()
    .range([height - margin.bottom, margin.top]);

    const yAxis = d3.axisLeft(y);

    // Define the tooltip
    const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'white')
    .style('padding', '5px')
    .style('border-radius', '4px')
    .style('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.2)')
    .style('opacity', 0)
    .style('pointer-events', 'none');

    // Create the circles
    svg.selectAll('circle')
    .data(data)
    .join('circle')
    .attr('class', 'circle')
    .attr('clip-path', 'url(#clip)')
    .attr('cx', d => x(d.first))
    .attr('cy', d => y(d.second))
    .attr('r', 5)
    .attr('fill', 'steelblue');

    // Create the clip path
    svg.append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom);

    // Draw the horizontal axis
    svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis);

    // Draw the vertical axis
    svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis);

    // Add tooltip interactivity
    svg.selectAll('circle')
    .on('mouseover', (event, d) => {
      tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);

      tooltip.html(`Date: ${d.date}<br>${firstCol}: ${d.first}<br>${secondCol}: ${d.second}`)
      .style('left', `${event.pageX}px`)
      .style('top', `${event.pageY - 28}px`);

      d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('fill', 'lightsteelblue');
    })
    .on('mouseout', (event) => {
      tooltip.transition()
      .duration(200)
      .style('opacity', 0);

      d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('fill', 'steelblue');
    });

    // Add zoom interactivity
    const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[margin.left, margin.top], [width - margin.right, height - margin.top]])
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.top]])
    .on('zoom', event => {
      const newX = event.transform.rescaleX(x);
      const newY = event.transform.rescaleY(y);

      svg.selectAll('.x-axis').call(xAxis.scale(newX));
      svg.selectAll('.y-axis').call(yAxis.scale(newY));

      svg.selectAll('circle')
      .attr('cx', d => newX(d.first))
      .attr('cy', d => newY(d.second));
    });

    svg.call(zoom);

  }, [firstData, secondData, firstCol, secondCol]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default WeatherVisitorScatterGraph;