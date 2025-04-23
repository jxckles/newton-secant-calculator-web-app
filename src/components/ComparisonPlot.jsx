import React, { useEffect, useRef } from 'react';
import functionPlot from 'function-plot';

const ComparisonPlot = ({ expression, newtonIterations, secantIterations }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current || !expression || 
        (!newtonIterations || !newtonIterations.length) && 
        (!secantIterations || !secantIterations.length)) {
      return;
    }

    try {
      // Determine the domain based on all iterations
      const allX = [
        ...(newtonIterations || []).map(iter => iter.x),
        ...(secantIterations || []).map(iter => iter.x)
      ];
      
      // Safety check
      if (allX.length === 0) return;
      
      const minX = Math.min(...allX);
      const maxX = Math.max(...allX);
      const padding = Math.abs(maxX - minX) * 0.5;
      const domain = [minX - padding, maxX + padding];

      // Create iteration points
      const newtonData = (newtonIterations || []).map((iter, i) => ({
        x: iter.x,
        y: iter.fx,
        index: i
      }));

      const secantData = (secantIterations || []).map((iter, i) => ({
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
          ...(newtonIterations && newtonIterations.length > 0 ? [{
            x: newtonIterations[newtonIterations.length - 1].x,
            color: 'rgba(0, 100, 255, 0.5)'
          }] : []),
          ...(secantIterations && secantIterations.length > 0 ? [{
            x: secantIterations[secantIterations.length - 1].x,
            color: 'rgba(255, 100, 0, 0.5)'
          }] : [])
        ],
        data: [
          {
            fn: expression,
            graphType: 'polyline'
          },
          ...(newtonData.length > 0 ? [{
            points: newtonData,
            fnType: 'points',
            graphType: 'scatter',
            color: 'blue',
            attr: {
              r: 3
            }
          },
          {
            points: newtonData,
            fnType: 'points',
            graphType: 'polyline',
            color: 'rgba(0, 0, 255, 0.5)',
          }] : []),
          ...(secantData.length > 0 ? [{
            points: secantData,
            fnType: 'points',
            graphType: 'scatter',
            color: 'orange',
            attr: {
              r: 3
            }
          },
          {
            points: secantData,
            fnType: 'points',
            graphType: 'polyline',
            color: 'rgba(255, 165, 0, 0.5)',
          }] : [])
        ],
        tip: {
          xLine: true,
          yLine: true,
          renderer: function(x, y, index) {
            const isNewton = index <= 3;
            const iterIdx = isNewton ? 
              newtonData.findIndex(d => Math.abs(d.x - x) < 0.001) : 
              secantData.findIndex(d => Math.abs(d.x - x) < 0.001);
            
            if (iterIdx >= 0) {
              return `<div class="tip-content">
                <div>${isNewton ? 'Newton' : 'Secant'}: Iteration ${iterIdx + 1}</div>
                <div>x = ${x.toFixed(6)}</div>
                <div>f(x) = ${y.toFixed(6)}</div>
              </div>`;
            }
            return '';
          }
        }
      });
    } catch (error) {
      console.error('Error rendering comparison plot:', error);
    }
  }, [expression, newtonIterations, secantIterations]);

  return (
    <div ref={rootRef} className="w-full h-full border rounded-md bg-card">
      {(!newtonIterations || !newtonIterations.length) && 
       (!secantIterations || !secantIterations.length) && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data to display
        </div>
      )}
    </div>
  );
};

export default ComparisonPlot;