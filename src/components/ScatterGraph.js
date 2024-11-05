import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterGraph = ({ firstData, firstDataName, firstDisplayName, secondData, secondDataName, secondDisplayName }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (firstData.length === 0 || secondData.length === 0) return;

    const data = firstData.map((d, i) => ({ date: d["Date"], first: d[firstDataName], second: secondData[i][secondDataName] }));

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 70, bottom: 40, left: 70 };

    // Define the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content
    svg.attr('viewBox', [0, 0, width, height]);

    // Create the horizontal scale
    const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.second))
    .nice()
    .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(x);

    // Create the vertical scale
    const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.first))
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
    .attr('cy', d => y(d.first))
    .attr('cx', d => x(d.second))
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

    // Draw the horizontal axis and the labels
    svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis);

    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .attr('text-anchor', 'middle')
    .text(secondDisplayName);

    // Draw the vertical axis and the labels
    svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis);

    svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .text(firstDisplayName);

    // Add tooltip interactivity
    svg.selectAll('circle')
    .on('mouseover', (event, d) => {
      tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);

      tooltip.html(`Date: ${d.date}<br>${firstDisplayName}: ${d.first}<br>${secondDisplayName}: ${d.second}`)
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
      .attr('cy', d => newY(d.first))
      .attr('cx', d => newX(d.second));
    });

    svg.call(zoom);

  });

  return (
    <svg ref={svgRef}></svg>
  );
};

export default ScatterGraph;