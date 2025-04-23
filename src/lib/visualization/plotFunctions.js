import * as d3 from "d3";
import { getFunctionPoints, getPlotRange } from "@/lib/math/parser";

export function createFunctionPlot(container, functionExpression, iterations, method) {
  // Extract root from iterations
  const lastIteration = iterations[iterations.length - 1];
  const root = iterations[iterations.length - 1].nextX;
  
  // Get suitable plotting range
  const { min, max } = getPlotRange(root);
  
  // Get function points for plotting
  const points = getFunctionPoints(functionExpression, min, max, 200);
  
  // Setup dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append("svg")
    .attr("width", container.clientWidth)
    .attr("height", container.clientHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Setup scales
  const xScale = d3.scaleLinear()
    .domain([min, max])
    .range([0, width]);
  
  // Find min and max y values
  const yMin = d3.min(points, d => d.y);
  const yMax = d3.max(points, d => d.y);
  const yMargin = (yMax - yMin) * 0.1;
  
  const yScale = d3.scaleLinear()
    .domain([yMin - yMargin, yMax + yMargin])
    .range([height, 0]);
  
  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height/2})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("x", width)
    .attr("y", -10)
    .attr("text-anchor", "end")
    .attr("fill", "currentColor")
    .text("x");
  
  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("text-anchor", "end")
    .attr("fill", "currentColor")
    .text("f(x)");
  
  // Draw x-axis line
  svg.append("line")
    .attr("x1", 0)
    .attr("y1", yScale(0))
    .attr("x2", width)
    .attr("y2", yScale(0))
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.3);
  
  // Draw y-axis line
  svg.append("line")
    .attr("x1", xScale(0))
    .attr("y1", 0)
    .attr("x2", xScale(0))
    .attr("y2", height)
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.3);
  
  // Add function curve
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX);
  
  svg.append("path")
    .datum(points)
    .attr("fill", "none")
    .attr("stroke", "hsl(var(--primary))")
    .attr("stroke-width", 2)
    .attr("d", line);
  
  // Draw iteration points
  const iterationPoints = iterations.map(iter => {
    if (method === "newton-raphson") {
      return {
        x: iter.x,
        y: iter.fx
      };
    } else if (method === "secant") {
      // For last iteration, only have one point
      if (iter.iteration === iterations.length) {
        return {
          x: iter.x1,
          y: iter.fx1
        };
      } else {
        // For other iterations, have two points
        return [
          { x: iter.x0, y: iter.fx0 },
          { x: iter.x1, y: iter.fx1 }
        ];
      }
    }
  }).flat().filter(Boolean);
  
  // Draw iteration points
  svg.selectAll(".iteration-point")
    .data(iterationPoints)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 4)
    .attr("fill", "hsl(var(--destructive))")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  // Highlight final root point
  svg.append("circle")
    .attr("cx", xScale(root))
    .attr("cy", yScale(0))
    .attr("r", 6)
    .attr("fill", "hsl(var(--chart-2))")
    .attr("stroke", "white")
    .attr("stroke-width", 2);
  
  // Add legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 120}, 20)`);
  
  // Function curve legend
  legend.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 20)
    .attr("y2", 0)
    .attr("stroke", "hsl(var(--primary))")
    .attr("stroke-width", 2);
  
  legend.append("text")
    .attr("x", 25)
    .attr("y", 5)
    .text("f(x)")
    .attr("font-size", 12);
  
  // Iteration points legend
  legend.append("circle")
    .attr("cx", 10)
    .attr("cy", 20)
    .attr("r", 4)
    .attr("fill", "hsl(var(--destructive))")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  legend.append("text")
    .attr("x", 25)
    .attr("y", 25)
    .text("Iterations")
    .attr("font-size", 12);
  
  // Root legend
  legend.append("circle")
    .attr("cx", 10)
    .attr("cy", 40)
    .attr("r", 6)
    .attr("fill", "hsl(var(--chart-2))")
    .attr("stroke", "white")
    .attr("stroke-width", 2);
  
  legend.append("text")
    .attr("x", 25)
    .attr("y", 45)
    .text("Root")
    .attr("font-size", 12);
  
  // Add title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .text(`Function: f(x) = ${functionExpression}`);
}