import { evaluate, differentiate } from './math-utils';

export function calculateNewtonRaphson(fnString, initialGuess, tolerance = 0.0001, maxIterations = 50) {
  if (!fnString || !initialGuess) {
    throw new Error('Function and initial guess are required');
  }

  // Validate inputs
  if (isNaN(initialGuess)) {
    throw new Error('Initial guess must be a number');
  }
  
  if (isNaN(tolerance) || tolerance <= 0) {
    throw new Error('Tolerance must be a positive number');
  }
  
  if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
    throw new Error('Maximum iterations must be a positive integer');
  }

  // Get derivative function
  const derivativeFnString = differentiate(fnString);
  
  let x = initialGuess;
  let iterations = [];
  let converged = false;
  
  for (let i = 0; i < maxIterations; i++) {
    // Calculate function value at current x
    const fx = evaluate(fnString, x);
    
    // Calculate derivative at current x
    const fPrime = evaluate(derivativeFnString, x);
    
    // Check if derivative is too close to zero
    if (Math.abs(fPrime) < 1e-10) {
      throw new Error('Derivative is too close to zero, method fails');
    }
    
    // Calculate next x
    const nextX = x - (fx / fPrime);
    
    // Calculate error
    const error = Math.abs(nextX - x);
    
    // Store iteration data
    iterations.push({
      x,
      fx,
      derivative: fPrime,
      error: error
    });
    
    // Update x
    x = nextX;
    
    // Check for convergence
    if (error < tolerance) {
      converged = true;
      break;
    }
  }
  
  // Add final iteration if converged on last step
  if (converged) {
    const finalFx = evaluate(fnString, x);
    iterations.push({
      x,
      fx: finalFx,
      derivative: evaluate(derivativeFnString, x),
      error: Math.abs(finalFx)
    });
  }
  
  return {
    fn: fnString,
    root: x,
    iterations,
    converged,
    tolerance,
    maxIterations
  };
}