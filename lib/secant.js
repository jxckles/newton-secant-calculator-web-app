import { evaluate } from './math-utils';

export function calculateSecant(fnString, x0, x1, tolerance = 0.0001, maxIterations = 50) {
  if (!fnString || x0 === undefined || x1 === undefined) {
    throw new Error('Function and both initial guesses are required');
  }

  // Validate inputs
  if (isNaN(x0) || isNaN(x1)) {
    throw new Error('Initial guesses must be numbers');
  }
  
  if (isNaN(tolerance) || tolerance <= 0) {
    throw new Error('Tolerance must be a positive number');
  }
  
  if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
    throw new Error('Maximum iterations must be a positive integer');
  }

  let iterations = [];
  let converged = false;
  
  // Calculate initial function values
  let fx0 = evaluate(fnString, x0);
  
  // Add first iteration
  iterations.push({
    x: x0,
    fx: fx0,
    error: Math.abs(fx0)
  });
  
  // Start iterations
  for (let i = 0; i < maxIterations; i++) {
    // Calculate function value at x1
    const fx1 = evaluate(fnString, x1);
    
    // Check if denominator is too close to zero
    if (Math.abs(fx1 - fx0) < 1e-10) {
      throw new Error('Division by near-zero value, method fails');
    }
    
    // Calculate next guess using secant formula
    const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
    
    // Calculate error
    const error = Math.abs(x2 - x1);
    
    // Store iteration data
    iterations.push({
      x: x1,
      fx: fx1,
      error: error
    });
    
    // Update values for next iteration
    x0 = x1;
    x1 = x2;
    fx0 = fx1;
    
    // Check for convergence
    if (error < tolerance) {
      converged = true;
      break;
    }
  }
  
  // Add final iteration if converged on last step
  if (converged) {
    const finalFx = evaluate(fnString, x1);
    iterations.push({
      x: x1,
      fx: finalFx,
      error: Math.abs(finalFx)
    });
  }
  
  return {
    fn: fnString,
    root: x1,
    iterations,
    converged,
    tolerance,
    maxIterations
  };
}