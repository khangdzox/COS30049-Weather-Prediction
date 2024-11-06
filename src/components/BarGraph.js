import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarGraph = ({ data, dataName, displayName }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 70, bottom: 40, left: 70 };

    // Define the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', [0, 0, width, height]);

    // Define the time parser
    const timeParse = d3.timeParse('%Y-%m-%d');

    // Define a time scale to get the tick format
    const tickFormat = d3.scaleTime()
    .domain(d3.extent(data, d => timeParse(d["Date"])))
    .tickFormat();

    // Create the horizontal scale
    const x = d3.scaleBand()
    .domain(data.map(d => d["Date"]))
    .range([margin.left, width - margin.right])
    .padding(0.1);

    const xAxis = d3.axisBottom(x).tickFormat(d => tickFormat(timeParse(d)));

    // Create the vertical scale
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[dataName])]).nice()
    .range([height - margin.bottom, margin.top]);

    // Add background grid
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

    // Add clip path to prevent bars from overflowing
    svg.append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', margin.left)
    .attr('width', width - margin.left - margin.right)
    .attr('height', height);

    // Create the bars
    svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('clip-path', 'url(#clip)')
    .attr('class', 'bar')
    .attr('x', d => x(d["Date"]))
    .attr('y', height - margin.bottom)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('fill', 'steelblue')
    .attr('stroke-width', 2)
    .transition()
    .duration(1000)
    .attr('y', d => y(d[dataName]))
    .attr('height', d => height - margin.bottom - y(d[dataName]));

    // Draw the horizontal axis and the labels
    svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .attr('clip-path', 'url(#clip)')
    .call(xAxis);

    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .attr('text-anchor', 'middle')
    .text('Date');

    // Draw the vertical axis and the labels
    svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

    svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .text(displayName);

    // Add tooltip interactivity
    svg.selectAll('.bar')
    .on('mouseover', (event, d) => {
      tooltip.transition()
      .duration(200)
      .style('opacity', 1);

      tooltip.html(`<b>Date</b>: ${d["Date"]}<br><b>${displayName}</b>: ${d[dataName]}`)
      .style('left', `${event.pageX + 5}px`)
      .style('top', `${event.pageY - 28}px`);

      // Highlight the bar
      d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('fill', 'lightsteelblue');
    })
    .on('mouseout', (event) => {
      // Hide the tooltip and reset the bar color
      tooltip.transition()
      .duration(200)
      .style('opacity', 0);

      d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('fill', 'steelblue');
    });

    // Add zoom interactivity
    const zoom = (svg) => {
      const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

      const zoom = d3.zoom()
      .scaleExtent([1, data.length / 16])
      .translateExtent(extent)
      .extent(extent)
      .on('zoom', (event) => {
        // Update the x-axis and the bars
        x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
        svg.selectAll('.bar').attr('x', d => x(d["Date"])).attr('width', x.bandwidth());
        svg.selectAll('.x-axis').call(xAxis);
      });

      svg.call(zoom);
    }

    svg.call(zoom);

  });

  return (
    <svg ref={svgRef}></svg>
  );
};

export default BarGraph;