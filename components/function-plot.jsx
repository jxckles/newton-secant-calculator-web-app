"use client"

import { useRef, useEffect } from 'react';
import { evaluate } from '@/lib/math-utils';

export function FunctionPlot({ result }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !result) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set up high resolution canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Get the root or last x value if not converged
    const rootX = result.converged ? result.root : result.iterations[result.iterations.length - 1].x;
    
    // Calculate suitable range around the root
    const padding = 5;
    const minX = rootX - padding;
    const maxX = rootX + padding;
    
    // Draw function
    drawFunction(ctx, result.fn, minX, maxX, rect.width, rect.height);
    
    // Draw iterations
    drawIterations(ctx, result.iterations, result.fn, minX, maxX, rect.width, rect.height);
    
    // Draw axes
    drawAxes(ctx, minX, maxX, rect.width, rect.height);
    
  }, [result]);
  
  if (!result) return null;
  
  return (
    <div className="w-full aspect-video bg-card rounded-md border relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ display: 'block' }}
      />
    </div>
  );
}

function drawFunction(ctx, fnString, minX, maxX, width, height) {
  ctx.clearRect(0, 0, width, height);
  
  // Find y range for function
  let minY = Infinity;
  let maxY = -Infinity;
  
  const samplePoints = 100;
  const points = [];
  
  for (let i = 0; i < samplePoints; i++) {
    const x = minX + (i / (samplePoints - 1)) * (maxX - minX);
    try {
      const y = evaluate(fnString, x);
      points.push({ x, y });
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    } catch (error) {
      // Skip points that cause evaluation errors
    }
  }
  
  // Add padding to y range
  const yPadding = (maxY - minY) * 0.1;
  minY -= yPadding;
  maxY += yPadding;
  
  // Ensure reasonable y range even for flat functions
  if (Math.abs(maxY - minY) < 0.01) {
    minY = -1;
    maxY = 1;
  }
  
  // Draw grid
  drawGrid(ctx, minX, maxX, minY, maxY, width, height);
  
  // Draw function
  ctx.beginPath();
  ctx.strokeStyle = 'hsl(var(--primary))';
  ctx.lineWidth = 2;
  
  let isFirst = true;
  for (const point of points) {
    const canvasX = mapRange(point.x, minX, maxX, 0, width);
    const canvasY = mapRange(point.y, minY, maxY, height, 0);
    
    if (isFirst) {
      ctx.moveTo(canvasX, canvasY);
      isFirst = false;
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  
  ctx.stroke();
  
  // Draw x-axis
  const xAxisY = mapRange(0, minY, maxY, height, 0);
  ctx.beginPath();
  ctx.strokeStyle = 'hsl(var(--foreground) / 0.5)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, xAxisY);
  ctx.lineTo(width, xAxisY);
  ctx.stroke();
  
  // Draw y-axis
  const yAxisX = mapRange(0, minX, maxX, 0, width);
  ctx.beginPath();
  ctx.moveTo(yAxisX, 0);
  ctx.lineTo(yAxisX, height);
  ctx.stroke();
}

function drawIterations(ctx, iterations, fnString, minX, maxX, width, height) {
  if (!iterations || iterations.length === 0) return;
  
  // Find y range for function
  let minY = Infinity;
  let maxY = -Infinity;
  
  const samplePoints = 100;
  
  for (let i = 0; i < samplePoints; i++) {
    const x = minX + (i / (samplePoints - 1)) * (maxX - minX);
    try {
      const y = evaluate(fnString, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    } catch (error) {
      // Skip points that cause evaluation errors
    }
  }
  
  // Add padding to y range
  const yPadding = (maxY - minY) * 0.1;
  minY -= yPadding;
  maxY += yPadding;
  
  // Ensure reasonable y range even for flat functions
  if (Math.abs(maxY - minY) < 0.01) {
    minY = -1;
    maxY = 1;
  }
  
  // Draw dots for iterations
  ctx.fillStyle = 'hsl(var(--chart-1))';
  
  iterations.forEach((iteration, i) => {
    const x = iteration.x;
    const y = iteration.fx;
    
    const canvasX = mapRange(x, minX, maxX, 0, width);
    const canvasY = mapRange(y, minY, maxY, height, 0);
    
    // Draw point
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw label for first and last points
    if (i === 0 || i === iterations.length - 1) {
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = '12px sans-serif';
      
      const label = i === 0 ? 'Start' : 'End';
      ctx.fillText(label, canvasX, canvasY - 8);
      
      ctx.fillStyle = 'hsl(var(--chart-1))';
    }
  });
}

function drawAxes(ctx, minX, maxX, width, height) {
  ctx.fillStyle = 'hsl(var(--foreground))';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '12px sans-serif';
  
  // X axis labels
  const xStep = (maxX - minX) / 5;
  for (let i = 0; i <= 5; i++) {
    const x = minX + i * xStep;
    const canvasX = mapRange(x, minX, maxX, 0, width);
    
    ctx.fillText(x.toFixed(1), canvasX, height + 5);
  }
}

function drawGrid(ctx, minX, maxX, minY, maxY, width, height) {
  ctx.strokeStyle = 'hsl(var(--muted) / 0.3)';
  ctx.lineWidth = 1;
  
  // Horizontal grid lines
  const yStep = (maxY - minY) / 4;
  for (let i = 0; i <= 4; i++) {
    const y = minY + i * yStep;
    const canvasY = mapRange(y, minY, maxY, height, 0);
    
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(width, canvasY);
    ctx.stroke();
  }
  
  // Vertical grid lines
  const xStep = (maxX - minX) / 4;
  for (let i = 0; i <= 4; i++) {
    const x = minX + i * xStep;
    const canvasX = mapRange(x, minX, maxX, 0, width);
    
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, height);
    ctx.stroke();
  }
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}