import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateFunctionPoints } from '@/lib/numericalMethods';

function FunctionPlot({ 
  expression, 
  result = null, 
  width = '100%', 
  height = 300,
  padding = { top: 20, right: 20, bottom: 30, left: 40 }
}) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !expression) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set correct canvas dimensions accounting for device pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine plot range
    let xMin = -10;
    let xMax = 10;
    
    // If we have results, adjust the range to focus on the root
    if (result && result.root !== null) {
      const root = result.root;
      xMin = root - 5;
      xMax = root + 5;
    }
    
    // Get function points
    const points = generateFunctionPoints(expression, xMin, xMax, 200);
    if (points.length === 0) return;
    
    // Find y min and max for scaling
    const yValues = points.map(p => p.y);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    // Set up coordinate transformation
    const plotWidth = rect.width - padding.left - padding.right;
    const plotHeight = rect.height - padding.top - padding.bottom;
    
    const xScale = plotWidth / (xMax - xMin);
    const yScale = plotHeight / (yMax - yMin);
    
    const transformX = x => padding.left + (x - xMin) * xScale;
    const transformY = y => rect.height - padding.bottom - (y - yMin) * yScale;
    
    // Draw axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // X axis (only if 0 is in the y range)
    if (yMin <= 0 && yMax >= 0) {
      const y0 = transformY(0);
      ctx.moveTo(padding.left, y0);
      ctx.lineTo(rect.width - padding.right, y0);
    }
    
    // Y axis (only if 0 is in the x range)
    if (xMin <= 0 && xMax >= 0) {
      const x0 = transformX(0);
      ctx.moveTo(x0, padding.top);
      ctx.lineTo(x0, rect.height - padding.bottom);
    }
    
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    
    // X grid
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue; // Skip the axis
      const xPos = transformX(x);
      ctx.beginPath();
      ctx.moveTo(xPos, padding.top);
      ctx.lineTo(xPos, rect.height - padding.bottom);
      ctx.stroke();
    }
    
    // Y grid
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y === 0) continue; // Skip the axis
      const yPos = transformY(y);
      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(rect.width - padding.right, yPos);
      ctx.stroke();
    }
    
    // Draw x and y labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    
    // X labels
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const xPos = transformX(x);
      ctx.fillText(x.toString(), xPos, rect.height - padding.bottom + 15);
    }
    
    ctx.textAlign = 'right';
    // Y labels
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const yPos = transformY(y);
      ctx.fillText(y.toString(), padding.left - 5, yPos + 4);
    }
    
    // Draw function
    ctx.strokeStyle = '#3B82F6'; // Blue
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Move to the first point
    if (points.length > 0) {
      ctx.moveTo(transformX(points[0].x), transformY(points[0].y));
      
      // Draw lines to subsequent points
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const prevPoint = points[i - 1];
        
        // Check for discontinuities (large jumps in y values)
        const yDiff = Math.abs(point.y - prevPoint.y);
        const threshold = (yMax - yMin) / 10; // Arbitrary threshold
        
        if (yDiff > threshold) {
          // End the current path and start a new one
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(transformX(point.x), transformY(point.y));
        } else {
          ctx.lineTo(transformX(point.x), transformY(point.y));
        }
      }
    }
    
    ctx.stroke();
    
    // Draw the root if available
    if (result && result.root !== null) {
      const rootX = transformX(result.root);
      const rootY = transformY(0); // Root is where f(x) = 0
      
      ctx.fillStyle = '#EF4444'; // Red
      ctx.beginPath();
      ctx.arc(rootX, rootY, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Label the root
      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Root: ${result.root.toFixed(4)}`, rootX, rootY - 10);
    }
    
    // Draw iteration points if available
    if (result && result.history && result.history.length > 0) {
      result.history.forEach((point, index) => {
        if (index === 0) return; // Skip the initial guess
        
        const x = transformX(point.x);
        const y = transformY(point.fx);
        
        // Gradient color from yellow to green based on iteration
        const ratio = index / result.history.length;
        const r = Math.round(255 * (1 - ratio));
        const g = Math.round(255);
        const b = Math.round(255 * ratio * 0.5);
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [expression, result, padding]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Function Plot</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          style={{ 
            width, 
            height, 
            display: 'block',
            backgroundColor: 'white'
          }}
        />
      </CardContent>
    </Card>
  );
}

export default FunctionPlot;