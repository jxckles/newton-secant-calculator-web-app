import React, { useEffect, useRef } from 'react';
import functionPlot from 'function-plot';
import { derivative } from 'mathjs';

const FunctionPlot = ({ expression, iterations, method }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current || !expression || !iterations || iterations.length === 0) return;

    try {
      // Determine the domain based on iterations
      const allX = iterations.map(iter => iter.x);
      const minX = Math.min(...allX);
      const maxX = Math.max(...allX);
      const padding = Math.abs(maxX - minX) * 0.5;
      const domain = [minX - padding, maxX + padding];

      // Get final root
      const root = iterations[iterations.length - 1].x;

      // Calculate derivative if Newton method
      let derivExpr = '';
      if (method === 'newton') {
        try {
          derivExpr = derivative(expression, 'x').toString();
        } catch (e) {
          console.error('Error calculating derivative:', e);
        }
      }

      // Create iteration points
      const iterationData = iterations.map((iter, i) => ({
        x: iter.x,
        y: iter.fx,
        index: i
      }));

      // Generate the plot
      functionPlot({
        target: rootRef.current,
        width: rootRef.current.clientWidth,
        height: rootRef.current.clientHeight,
        grid: true,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain },
        tip: {
          xLine: true,
          yLine: true
        },
        annotations: [
          {
            x: root,
            color: 'rgba(100, 170, 0, 0.5)'
          }
        ],
        data: [
          {
            fn: expression,
            graphType: 'polyline'
          },
          ...(derivExpr ? [{
            fn: derivExpr,
            graphType: 'polyline',
            skipTip: true,
            color: 'rgba(100, 100, 255, 0.4)'
          }] : []),
          {
            points: iterationData,
            fnType: 'points',
            graphType: 'scatter',
            color: 'red',
            attr: {
              r: 3
            }
          },
          {
            points: iterationData,
            fnType: 'points',
            graphType: 'polyline',
            color: 'rgba(255, 0, 0, 0.5)',
          }
        ]
      });
    } catch (error) {
      console.error('Error rendering plot:', error);
    }
  }, [expression, iterations, method]);

  return (
    <div ref={rootRef} className="w-full h-full border rounded-md bg-card" />
  );
};

export default FunctionPlot;