import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Legend } from '../libs/d3-color-legend';
import * as topojson from 'topojson-client';
import ausMapData from './ausMapData.json'; // Make sure to have the Australia map data in topojson format

const mapIdToState = {
  0: 'NSW',
  1: 'VIC',
  2: 'QLD',
  3: 'SA',
  4: 'WA',
  5: 'TAS',
  6: 'NT',
  7: 'ACT',
};

const mapStateToName = {
  'NSW': 'New South Wales',
  'VIC': 'Victoria',
  'QLD': 'Queensland',
  'SA': 'South Australia',
  'WA': 'Western Australia',
  'TAS': 'Tasmania',
  'NT': 'Northern Territory',
  'ACT': 'Australian Capital Territory',
};

const AusMap = ({ data, dataName, displayName, colorInterpolate, domain }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 700;

    // Define the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', [0, 0, width, height]);

    // Define the projection and path
    const projection = d3.geoMercator()
    .center([133, -28])
    .scale(1000)
    .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    // Define the color scale
    const colorScale = d3.scaleSequential(colorInterpolate ? colorInterpolate : d3.interpolateYlOrRd)
    .domain(domain ? domain : d3.extent(data, d => d[dataName]));

    // Define the tooltip
    const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', '#fff')
    .style('padding', '5px')
    .style('border-radius', '4px')
    .style('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.2)')
    .style('opacity', 0)
    .style('pointer-events', 'none');

    // Load the Australia map data
    const aus = topojson.feature(ausMapData, ausMapData.objects.austates).features;

    // Draw the color legend
    svg.append('g')
    .attr('transform', `translate(50, ${height - 50})`)
    .append(() => Legend(colorScale, { title: displayName }));

    // Draw the map
    svg.selectAll('path')
    .data(aus)
    .enter().append('path')
    .attr('d', path)
    .attr('fill', (d) => {
      const stateTemp = data.find(temp => temp['State'] === mapIdToState[d.id]);
      return stateTemp ? colorScale(stateTemp[dataName]) : '#ddd';
    })
    .attr('stroke', '#555')
    .on('mouseover', (event, d) => {
      // Show tooltip with state name and temperature
      const stateTemp = data.find(temp => temp['State'] === mapIdToState[d.id]);

      tooltip.html(`<b>State</b>: ${mapStateToName[mapIdToState[d.id]]}<br /> <b>${displayName}</b>: ${stateTemp ? stateTemp[dataName] : 'No data'}`)
      .transition()
      .duration(200)
      .style('opacity', 1);

      // reduce opacity of other states
      svg.selectAll('path')
      .transition()
      .duration(200)
      .filter((e) => e !== d)
      .attr('fill-opacity', 0.2)
      .attr('stroke-opacity', 0.2);

      // highlight current state
      d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1);
    })
    .on('mousemove', (event) => {
      // Move tooltip with mouse
      tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
    })
    .on('mouseout', () => {
      // Hide tooltip and reset state opacity
      tooltip.transition()
      .duration(200)
      .style('opacity', 0);

      svg.selectAll('path')
      .transition()
      .duration(200)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1);
    });

  });

  return (
    <svg ref={svgRef}></svg>
  );
};

export default AusMap;