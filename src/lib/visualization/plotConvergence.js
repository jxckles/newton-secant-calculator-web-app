import * as d3 from "d3";

export function createConvergencePlot(container, iterations) {
  // Setup dimensions
  const margin = { top: 40, right: 40, bottom: 60, left: 70 };
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append("svg")
    .attr("width", container.clientWidth)
    .attr("height", container.clientHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Extract iteration numbers and errors
  const iterationData = iterations.map(iter => ({
    iteration: iter.iteration,
    error: iter.error || 0
  }));
  
  // Setup scales
  const xScale = d3.scaleLinear()
    .domain([1, d3.max(iterationData, d => d.iteration)])
    .range([0, width]);
  
  const yScale = d3.scaleLog()
    .domain([
      Math.max(1e-16, d3.min(iterationData, d => d.error)), 
      d3.max(iterationData, d => d.error)
    ])
    .range([height, 0])
    .nice();
  
  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(iterationData.length).tickFormat(d3.format("d")))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("fill", "currentColor")
    .text("Iteration");
  
  // Add y-axis (logarithmic scale)
  svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d => {
      return d.toExponential(1);
    }))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .attr("fill", "currentColor")
    .text("Error (log scale)");
  
  // Add grid lines
  svg.append("g")
    .attr("class", "grid")
    .attr("opacity", 0.1)
    .call(d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat("")
    );
  
  // Create line generator
  const line = d3.line()
    .x(d => xScale(d.iteration))
    .y(d => yScale(d.error));
  
  // Add the error line
  svg.append("path")
    .datum(iterationData)
    .attr("fill", "none")
    .attr("stroke", "hsl(var(--primary))")
    .attr("stroke-width", 2)
    .attr("d", line);
  
  // Add data points
  svg.selectAll(".data-point")
    .data(iterationData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.iteration))
    .attr("cy", d => yScale(d.error))
    .attr("r", 4)
    .attr("fill", "hsl(var(--primary))")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  // Add title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .text("Convergence Plot: Error vs. Iteration");
}