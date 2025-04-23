import * as math from 'mathjs';

// Helper function to evaluate a function and handle errors
const evaluateFunction = (funcStr, x) => {
  try {
    return math.evaluate(funcStr, { x });
  } catch (error) {
    throw new Error(`Error evaluating function at x = ${x}: ${error.message}`);
  }
};

// Helper function to calculate derivative numerically (for Newton-Raphson)
const evaluateDerivative = (funcStr, x, h = 0.0001) => {
  try {
    const fxPlusH = evaluateFunction(funcStr, x + h);
    const fxMinusH = evaluateFunction(funcStr, x - h);
    return (fxPlusH - fxMinusH) / (2 * h);
  } catch (error) {
    throw new Error(`Error calculating derivative at x = ${x}: ${error.message}`);
  }
};

// Compute convergence rate
const computeConvergenceRate = (iterations) => {
  if (iterations.length < 4) return null;
  
  // Use the last few iterations for calculation
  const n = iterations.length;
  const e1 = Math.abs(iterations[n-1].x - iterations[n-2].x);
  const e2 = Math.abs(iterations[n-2].x - iterations[n-3].x);
  const e3 = Math.abs(iterations[n-3].x - iterations[n-4].x);
  
  // Compute approximate convergence rate
  if (e2 === 0 || e3 === 0) return null;
  
  return Math.log(e1 / e2) / Math.log(e2 / e3);
};

// Newton-Raphson Method
export const calculateNewton = (funcStr, x0, tolerance, maxIterations) => {
  let iterations = [];
  let x = x0;
  let fx = evaluateFunction(funcStr, x);
  
  iterations.push({ 
    iteration: 0, 
    x, 
    fx, 
    fpx: null, 
    error: null 
  });
  
  let converged = false;
  let iterCount = 0;
  let error = Infinity;
  
  while (!converged && iterCount < maxIterations) {
    iterCount++;
    
    // Calculate derivative
    const fpx = evaluateDerivative(funcStr, x);
    
    // Check if derivative is close to zero
    if (Math.abs(fpx) < 1e-10) {
      throw new Error('Derivative is too close to zero. Method may not converge.');
    }
    
    // Calculate next approximation
    const xNext = x - fx / fpx;
    const fxNext = evaluateFunction(funcStr, xNext);
    
    // Calculate error
    error = Math.abs(xNext - x);
    
    // Store iteration data
    iterations.push({ 
      iteration: iterCount, 
      x: xNext, 
      fx: fxNext, 
      fpx, 
      error 
    });
    
    // Update for next iteration
    x = xNext;
    fx = fxNext;
    
    // Check for convergence
    converged = error < tolerance || Math.abs(fx) < tolerance;
  }
  
  // Calculate convergence rate
  const convergenceRate = computeConvergenceRate(iterations);
  
  return {
    iterations,
    root: x,
    functionValue: fx,
    error,
    converged,
    iterationsCount: iterCount,
    convergenceRate,
    methodName: 'Newton-Raphson'
  };
};

// Secant Method
export const calculateSecant = (funcStr, x0, x1, tolerance, maxIterations) => {
  let iterations = [];
  
  let xPrev = x0;
  let fxPrev = evaluateFunction(funcStr, xPrev);
  
  let x = x1;
  let fx = evaluateFunction(funcStr, x);
  
  iterations.push({ 
    iteration: 0, 
    x: xPrev, 
    fx: fxPrev,
    error: null 
  });
  
  iterations.push({ 
    iteration: 1, 
    x, 
    fx,
    error: Math.abs(x - xPrev) 
  });
  
  let converged = false;
  let iterCount = 1;
  let error = Math.abs(x - xPrev);
  
  while (!converged && iterCount < maxIterations) {
    iterCount++;
    
    // Check for division by zero
    if (Math.abs(fx - fxPrev) < 1e-10) {
      throw new Error('The difference between consecutive function values is too small. Method may not converge.');
    }
    
    // Calculate next approximation
    const xNext = x - fx * (x - xPrev) / (fx - fxPrev);
    const fxNext = evaluateFunction(funcStr, xNext);
    
    // Calculate error
    error = Math.abs(xNext - x);
    
    // Store iteration data
    iterations.push({ 
      iteration: iterCount, 
      x: xNext, 
      fx: fxNext,
      error
    });
    
    // Update for next iteration
    xPrev = x;
    fxPrev = fx;
    x = xNext;
    fx = fxNext;
    
    // Check for convergence
    converged = error < tolerance || Math.abs(fx) < tolerance;
  }
  
  // Calculate convergence rate
  const convergenceRate = computeConvergenceRate(iterations);
  
  return {
    iterations,
    root: x,
    functionValue: fx,
    error,
    converged,
    iterationsCount: iterCount,
    convergenceRate,
    methodName: 'Secant'
  };
};