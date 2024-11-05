import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, dataName, displayName }) => {
  const svgRef = useRef();

  const lineAnimationDuration = 500;

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 70, bottom: 40, left: 70 };

    // Define the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', [0, 0, width, height]);

    let timeParse;
    let xFrequency;

    // Define the time parser and x-ticks frequency
    if (data[0]["Date"].split('-').length === 3) {
      timeParse = d3.timeParse('%Y-%m-%d');
      xFrequency = d3.timeDay.every(1);
    } else {
      // Define the time parser and formatter
      timeParse = d3.timeParse('%Y-%m');
      xFrequency = d3.timeMonth.every(1);
    }

    // Create the horizontal scale
    const x = d3.scaleTime()
    .domain(d3.extent(data, d => timeParse(d["Date"])))
    .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(x).ticks(xFrequency);

    // Create the vertical scale
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[dataName])]).nice()
    .range([height - margin.bottom, margin.top]);

    // Define the line
    const line = d3.line()
    .x(d => x(timeParse(d["Date"])))
    .y(d => y(d[dataName]));

    // Draw the horizontal axis and the labels
    svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis);

    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .attr('text-anchor', 'middle')
    .text('Date');

    // Draw the vertical axis and the labels
    svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

    svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .text(displayName);

    // Add background grid
    svg.append('g')
    .attr('class', 'x-grid')
    .selectAll('line')
    .data(x.ticks())
    .join('line')
    .attr('stroke', 'rgba(0, 0, 0, 0.1)')
    .attr('x1', d => x(d))
    .attr('x2', d => x(d))
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom);

    svg.append('g')
    .attr('class', 'y-grid')
    .selectAll('line')
    .data(y.ticks())
    .join('line')
    .attr('stroke', 'rgba(0, 0, 0, 0.1)')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', d => y(d))
    .attr('y2', d => y(d));

    // Draw the line
    const path = svg.append('path')
    .datum(data)
    .attr('clip-path', 'url(#clip)')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

    const totalLength = path.node().getTotalLength();

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

    // Add clip path to prevent overflowing
    svg.append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', margin.left)
    .attr('width', width - margin.left - margin.right)
    .attr('height', height);

    // add slightly bigger clippath for the dots
    svg.append('clipPath')
    .attr('id', 'clip-dots')
    .append('rect')
    .attr('x', margin.left - 5)
    .attr('width', width - margin.left - margin.right + 10)
    .attr('height', height + 10);

    // Create the dots
    svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('clip-path', 'url(#clip-dots)')
    .attr('cx', d => x(timeParse(d["Date"])))
    .attr('cy', d => y(d[dataName]))
    .attr('r', 5)
    .attr('fill', 'steelblue')
    .style('opacity', 0);

    // Animate the line and the dots
    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(lineAnimationDuration)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0)
    .end().then(() => {
      path.attr('stroke-dasharray', null);

      svg.selectAll('.dot')
      .transition()
      .duration(lineAnimationDuration)
      .style('opacity', 1);
    });

    // Add the interactivity to the dots
    svg.selectAll('.dot')
    .on('mouseover', (event, d) => {
      tooltip.transition()
      .duration(200)
      .style('opacity', 1);

      tooltip.html(`Date: ${timeParse(d["Date"]).toLocaleDateString()}<br>Value: ${d[dataName]}`)
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

    // Define the zoom behavior
    const zoom = d3.zoom()
    .scaleExtent([1, data.length / 16])
    .translateExtent([[margin.left, margin.top], [width - margin.right, height - margin.top]])
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.top]])
    .on('zoom', (event) => {
      const newX = event.transform.rescaleX(x);

      svg.select('.x-axis').call(xAxis.scale(newX));

      // rescale the grid
      svg.selectAll('.x-grid').selectAll('line')
      .data(newX.ticks())
      .join('line')
      .attr('stroke', 'rgba(0, 0, 0, 0.1)')
      .attr('x1', d => newX(d))
      .attr('x2', d => newX(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom);

      path.attr('d', line.x(d => newX(timeParse(d["Date"]))));

      svg.selectAll('.dot').attr('cx', d => newX(timeParse(d["Date"])));
    });

    svg.call(zoom);

  });

  return (
    <svg ref={svgRef}></svg>
  );
};

export default LineGraph;