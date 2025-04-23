import * as d3 from "d3";

export function createComparisonPlot(container, newtonRaphsonIterations, secantIterations) {
  // Setup dimensions
  const margin = { top: 40, right: 100, bottom: 60, left: 70 };
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
  const newtonData = newtonRaphsonIterations.map(iter => ({
    iteration: iter.iteration,
    error: iter.error || 0
  }));
  
  const secantData = secantIterations.map(iter => ({
    iteration: iter.iteration,
    error: iter.error || 0
  }));
  
  // Find max iterations
  const maxIterations = Math.max(
    newtonData.length > 0 ? d3.max(newtonData, d => d.iteration) : 0,
    secantData.length > 0 ? d3.max(secantData, d => d.iteration) : 0
  );
  
  // Find min and max errors (with safeguards)
  const minError = Math.max(1e-16, Math.min(
    newtonData.length > 0 ? d3.min(newtonData, d => d.error) : 1,
    secantData.length > 0 ? d3.min(secantData, d => d.error) : 1
  ));
  
  const maxError = Math.max(
    newtonData.length > 0 ? d3.max(newtonData, d => d.error) : 1,
    secantData.length > 0 ? d3.max(secantData, d => d.error) : 1
  );
  
  // Setup scales
  const xScale = d3.scaleLinear()
    .domain([1, maxIterations])
    .range([0, width]);
  
  const yScale = d3.scaleLog()
    .domain([minError, maxError])
    .range([height, 0])
    .nice();
  
  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(Math.min(maxIterations, 10)).tickFormat(d3.format("d")))
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
  
  // Create line generators
  const newtonLine = d3.line()
    .x(d => xScale(d.iteration))
    .y(d => yScale(d.error));
  
  const secantLine = d3.line()
    .x(d => xScale(d.iteration))
    .y(d => yScale(d.error));
  
  // Add Newton-Raphson line
  svg.append("path")
    .datum(newtonData)
    .attr("fill", "none")
    .attr("stroke", "hsl(var(--primary))")
    .attr("stroke-width", 2)
    .attr("d", newtonLine);
  
  // Add Secant line
  svg.append("path")
    .datum(secantData)
    .attr("fill", "none")
    .attr("stroke", "hsl(var(--destructive))")
    .attr("stroke-width", 2)
    .attr("d", secantLine);
  
  // Add Newton-Raphson data points
  svg.selectAll(".newton-point")
    .data(newtonData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.iteration))
    .attr("cy", d => yScale(d.error))
    .attr("r", 4)
    .attr("fill", "hsl(var(--primary))")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  // Add Secant data points
  svg.selectAll(".secant-point")
    .data(secantData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.iteration))
    .attr("cy", d => yScale(d.error))
    .attr("r", 4)
    .attr("fill", "hsl(var(--destructive))")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  // Add legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width + 10}, 10)`);
  
  // Newton-Raphson legend
  legend.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 20)
    .attr("y2", 0)
    .attr("stroke", "hsl(var(--primary))")
    .attr("stroke-width", 2);
  
  legend.append("circle")
    .attr("cx", 10)
    .attr("cy", 0)
    .attr("r", 4)
    .attr("fill", "hsl(var(--primary))")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  legend.append("text")
    .attr("x", 30)
    .attr("y", 5)
    .text("Newton-Raphson")
    .attr("font-size", 12);
  
  // Secant legend
  legend.append("line")
    .attr("x1", 0)
    .attr("y1", 25)
    .attr("x2", 20)
    .attr("y2", 25)
    .attr("stroke", "hsl(var(--destructive))")
    .attr("stroke-width", 2);
  
  legend.append("circle")
    .attr("cx", 10)
    .attr("cy", 25)
    .attr("r", 4)
    .attr("fill", "hsl(var(--destructive))")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  legend.append("text")
    .attr("x", 30)
    .attr("y", 30)
    .text("Secant")
    .attr("font-size", 12);
  
  // Add title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .text("Method Comparison: Error vs. Iteration");
}