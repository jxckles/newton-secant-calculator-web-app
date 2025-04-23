import { evaluateFunction, evaluateDerivative } from "./parser";

export async function newtonRaphson(functionExpression, { x0, tolerance, maxIterations }) {
  const startTime = performance.now();
  const iterations = [];
  
  let x = x0;
  let iteration = 0;
  let converged = false;
  let error = Infinity;
  
  try {
    while (iteration < maxIterations && !converged) {
      // Evaluate function and its derivative
      const fx = evaluateFunction(functionExpression, x);
      const dfx = evaluateDerivative(functionExpression, x);
      
      // Check if derivative is zero (or very close to zero)
      if (Math.abs(dfx) < 1e-10) {
        throw new Error("Derivative is zero or very close to zero. Cannot continue.");
      }
      
      // Calculate next approximation
      const nextX = x - (fx / dfx);
      
      // Calculate error
      error = Math.abs(nextX - x);
      
      // Store iteration data
      iterations.push({
        iteration: iteration + 1,
        x,
        fx,
        dfx,
        nextX,
        error
      });
      
      // Check for convergence
      if (error < tolerance) {
        converged = true;
      }
      
      // Prepare for next iteration
      x = nextX;
      iteration++;
    }
    
    const endTime = performance.now();
    
    return {
      root: x,
      iterations,
      converged,
      totalIterations: iteration,
      executionTime: endTime - startTime
    };
  } catch (error) {
    throw new Error(`Newton-Raphson method failed: ${error.message}`);
  }
}