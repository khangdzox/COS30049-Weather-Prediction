import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const WeatherLineGraph = ({ dataType, fromDate, toDate }) => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  const lineAnimationDuration = 500;

  useEffect(() => {
    // fetch(`http://localhost:3000/data/weather/${dataType}?from=${fromDate}&to=${toDate}`)
    //     .then(response => response.json())
    //     .then(data => setData(data))
    //     .catch(error => console.error('Error fetching data:', error));

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

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };

    const x = d3.scalePoint()
    .domain(data.map(d => d.date))
    .range([margin.left, width - margin.right])
    .padding(0.5); // Add padding to distribute ticks evenly

    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

    const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

    svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

    svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

    const path = svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

    const totalLength = path.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(lineAnimationDuration)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);

    const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'white')
    .style('padding', '5px')
    .style('border-radius', '4px')
    .style('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.2)')
    .style('opacity', 0)
    .style('pointer-events', 'none');

    svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.value))
    .attr('r', 5)
    .attr('fill', 'steelblue')
    .style('opacity', 0)
    .transition()
    .duration(lineAnimationDuration)
    .delay(lineAnimationDuration * 0.8)
    .style('opacity', 1);

    svg.selectAll('.dot')
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
    <svg ref={svgRef} width={800} height={400}></svg>
  );
};

export default WeatherLineGraph;