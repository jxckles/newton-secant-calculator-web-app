"use client"

import { useRef, useEffect } from 'react';

export function ConvergencePlot({ results }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !results) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set up high resolution canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Prepare data for plotting
    const methods = Object.keys(results);
    const colors = {
      newton: 'hsl(var(--chart-1))',
      secant: 'hsl(var(--chart-2))'
    };
    
    // Find max iterations across all methods
    const maxIterations = Math.max(
      ...methods.map(method => results[method].iterations.length)
    );
    
    // Find max error for y-scale
    const allErrors = methods.flatMap(method => 
      results[method].iterations.map(iter => iter.error)
    );
    const maxError = Math.max(...allErrors);
    const minError = Math.min(...allErrors);
    
    // Log scale for errors (y-axis)
    const logMinError = Math.log10(Math.max(minError, 1e-10));
    const logMaxError = Math.log10(maxError);
    
    // Draw grid
    drawGrid(ctx, maxIterations, logMinError, logMaxError, rect.width, rect.height);
    
    // Draw convergence lines for each method
    methods.forEach((method, i) => {
      drawConvergenceLine(
        ctx, 
        results[method].iterations, 
        maxIterations, 
        logMinError, 
        logMaxError, 
        colors[method], 
        rect.width, 
        rect.height
      );
    });
    
    // Draw legend
    drawLegend(ctx, methods, colors, rect.width, rect.height);
    
  }, [results]);
  
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

function drawConvergenceLine(ctx, iterations, maxIterations, logMinError, logMaxError, color, width, height) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  
  iterations.forEach((iteration, i) => {
    const x = mapRange(i, 0, maxIterations - 1, 50, width - 20);
    
    // Use log scale for errors
    const logError = Math.log10(Math.max(iteration.error, 1e-10));
    const y = mapRange(logError, logMaxError, logMinError, 20, height - 50);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Draw points
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.stroke();
}

function drawGrid(ctx, maxIterations, logMinError, logMaxError, width, height) {
  ctx.strokeStyle = 'hsl(var(--muted) / 0.3)';
  ctx.lineWidth = 1;
  
  // Horizontal grid lines (powers of 10 for error)
  const minPower = Math.floor(logMinError);
  const maxPower = Math.ceil(logMaxError);
  
  for (let power = minPower; power <= maxPower; power++) {
    const y = mapRange(power, logMaxError, logMinError, 20, height - 50);
    
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(width - 20, y);
    ctx.stroke();
    
    // Add y-axis labels
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '12px sans-serif';
    ctx.fillText(`10^${power}`, 45, y);
  }
  
  // Vertical grid lines (iterations)
  const step = Math.max(1, Math.floor(maxIterations / 10));
  for (let i = 0; i <= maxIterations; i += step) {
    const x = mapRange(i, 0, maxIterations - 1, 50, width - 20);
    
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, height - 50);
    ctx.stroke();
    
    // Add x-axis labels
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '12px sans-serif';
    ctx.fillText(i.toString(), x, height - 45);
  }
  
  // Axis labels
  ctx.fillStyle = 'hsl(var(--foreground))';
  ctx.textAlign = 'center';
  ctx.font = '14px sans-serif';
  ctx.fillText('Iterations', width / 2, height - 15);
  
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Error (log scale)', 0, 0);
  ctx.restore();
}

function drawLegend(ctx, methods, colors, width, height) {
  const legendX = width - 180;
  const legendY = 30;
  const itemHeight = 25;
  
  // Background
  ctx.fillStyle = 'hsl(var(--card) / 0.8)';
  ctx.strokeStyle = 'hsl(var(--border))';
  ctx.lineWidth = 1;
  ctx.fillRect(legendX, legendY, 160, methods.length * itemHeight + 10);
  ctx.strokeRect(legendX, legendY, 160, methods.length * itemHeight + 10);
  
  // Items
  methods.forEach((method, i) => {
    const y = legendY + 20 + i * itemHeight;
    
    // Line
    ctx.strokeStyle = colors[method];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(legendX + 15, y);
    ctx.lineTo(legendX + 45, y);
    ctx.stroke();
    
    // Point
    ctx.fillStyle = colors[method];
    ctx.beginPath();
    ctx.arc(legendX + 30, y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Label
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '14px sans-serif';
    ctx.fillText(
      method === 'newton' ? 'Newton-Raphson' : 'Secant', 
      legendX + 55, 
      y
    );
  });
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}