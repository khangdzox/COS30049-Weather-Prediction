import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const WeatherLineGraph = ({ dataType, fromDate, toDate }) => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // fetch(`http://localhost:3000/data/weather/${dataType}?from=${fromDate}&to=${toDate}`)
    //     .then(response => response.json())
    //     .then(data => setData(data))
    //     .catch(error => console.error('Error fetching data:', error));

    // [0.2, 0, 8.2, 0, 3.4, 2.2, 0, 1.4, 0, 0.4, 1.4, 6.4, 0.2, 0.2, 0, 1.2]
    setData([
      { date: '2024-09-10', value: 0.2 },
      { date: '2024-09-11', value: 0 },
      { date: '2024-09-12', value: 8.2 },
      { date: '2024-09-13', value: 0 },
      { date: '2024-09-14', value: 3.4 },
      { date: '2024-09-15', value: 2.2 },
      { date: '2024-09-16', value: 0 },
      { date: '2024-09-17', value: 1.4 },
      { date: '2024-09-18', value: 0 },
      { date: '2024-09-19', value: 0.4 },
      { date: '2024-09-20', value: 1.4 },
      { date: '2024-09-21', value: 6.4 },
      { date: '2024-09-22', value: 0.2 },
      { date: '2024-09-23', value: 0.2 },
      { date: '2024-09-24', value: 0 },
      { date: '2024-09-25', value: 1.2 }
    ])
  }, [dataType, fromDate, toDate]);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', [0, 0, width, height]);

    const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([margin.left, width - margin.right])
    .padding(0.1);

    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

    svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

    svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

    const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'white')
    .style('padding', '5px')
    .style('border-radius', '4px')
    .style('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.2)')
    .style('opacity', 0)
    .style('pointer-events', 'none');

    svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.date))
    .attr('y', height - margin.bottom)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('fill', 'steelblue')
    .attr('stroke-width', 2)
    .transition()
    .duration(1000)
    .attr('y', d => y(d.value))
    .attr('height', d => height - margin.bottom - y(d.value));

    svg.selectAll('.bar')
    .on('mouseover', (event, d) => {
      tooltip.transition()
      .duration(200)
      .style('opacity', 1);

      tooltip.html(`Date: ${d.date}<br>Value: ${d.value}`)
      .style('left', `${event.pageX + 5}px`)
      .style('top', `${event.pageY - 28}px`);

      d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('fill', 'lightsteelblue');
    })
    .on('mouseout', (event, d) => {
      tooltip.transition()
      .duration(200)
      .style('opacity', 0);

      d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('fill', 'steelblue');
    });

  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default WeatherLineGraph;