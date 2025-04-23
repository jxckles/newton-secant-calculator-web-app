import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table.jsx';

const ComparisonTable = ({ 
  newtonIterations, 
  secantIterations, 
  newtonRoot, 
  secantRoot,
  newtonError,
  secantError,
  decimalPlaces = 6
}) => {
  // Format number to specified decimal places
  const format = (num) => {
    if (num === undefined || num === null || isNaN(num)) return 'N/A';
    return num.toFixed(decimalPlaces);
  };

  const getMetrics = () => {
    // If either method has error, handle it
    if (newtonError || secantError) {
      return {
        newtonIterCount: newtonError ? 'Failed' : newtonIterations.length,
        secantIterCount: secantError ? 'Failed' : secantIterations.length,
        newtonFinalError: newtonError ? 'N/A' : format(Math.abs(newtonIterations[newtonIterations.length - 1].fx)),
        secantFinalError: secantError ? 'N/A' : format(Math.abs(secantIterations[secantIterations.length - 1].fx)),
        rootDifference: (newtonError || secantError) ? 'N/A' : format(Math.abs(newtonRoot - secantRoot)),
        fasterMethod: newtonError ? 
          (secantError ? 'Both failed' : 'Secant') : 
          (secantError ? 'Newton' : 
            (newtonIterations.length < secantIterations.length ? 'Newton' : 
              (newtonIterations.length > secantIterations.length ? 'Secant' : 'Equal')))
      };
    }

    // Calculate metrics
    const newtonIterCount = newtonIterations.length;
    const secantIterCount = secantIterations.length;
    const newtonFinalError = Math.abs(newtonIterations[newtonIterCount - 1].fx);
    const secantFinalError = Math.abs(secantIterations[secantIterCount - 1].fx);
    const rootDifference = Math.abs(newtonRoot - secantRoot);
    
    // Determine which method is faster
    const fasterMethod = newtonIterCount < secantIterCount ? 
      'Newton' : (newtonIterCount > secantIterCount ? 'Secant' : 'Equal');
    
    return {
      newtonIterCount,
      secantIterCount,
      newtonFinalError: format(newtonFinalError),
      secantFinalError: format(secantFinalError),
      rootDifference: format(rootDifference),
      fasterMethod
    };
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Performance Comparison</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Newton-Raphson</TableHead>
            <TableHead>Secant</TableHead>
            <TableHead>Comparison</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Iterations</TableCell>
            <TableCell>{metrics.newtonIterCount}</TableCell>
            <TableCell>{metrics.secantIterCount}</TableCell>
            <TableCell>
              {typeof metrics.newtonIterCount === 'number' && typeof metrics.secantIterCount === 'number' ? 
                `${Math.abs(metrics.newtonIterCount - metrics.secantIterCount)} iterations difference` : 
                'N/A'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Root Found</TableCell>
            <TableCell>{newtonError ? 'Failed' : format(newtonRoot)}</TableCell>
            <TableCell>{secantError ? 'Failed' : format(secantRoot)}</TableCell>
            <TableCell>Difference: {metrics.rootDifference}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Final Error |f(x)|</TableCell>
            <TableCell>{metrics.newtonFinalError}</TableCell>
            <TableCell>{metrics.secantFinalError}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Convergence Rate</TableCell>
            <TableCell>Quadratic (2)</TableCell>
            <TableCell>Superlinear (~1.6)</TableCell>
            <TableCell>Faster method: {metrics.fasterMethod}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="p-4 bg-muted rounded-md">
        <h4 className="font-semibold mb-2">Analysis</h4>
        <p>
          {metrics.fasterMethod === 'Newton' ? 
            "Newton-Raphson converged faster in this case, demonstrating its quadratic convergence advantage when the initial guess is good and the derivative is well-behaved." :
           metrics.fasterMethod === 'Secant' ? 
            "Secant method converged faster in this case, showing its robustness when Newton-Raphson might struggle with the derivative or initial condition." :
           metrics.fasterMethod === 'Equal' ? 
            "Both methods required the same number of iterations, though they may have found slightly different roots." :
            "At least one method failed to converge with the given parameters."}
        </p>
      </div>
    </div>
  );
};

export default ComparisonTable;