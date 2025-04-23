import { evaluateFunction } from "./parser";

export async function secant(functionExpression, { x0, x1, tolerance, maxIterations }) {
  const startTime = performance.now();
  const iterations = [];
  
  let converged = false;
  let iteration = 0;
  let error = Infinity;
  
  // Initial values
  let x_prev = x0;
  let x_curr = x1;
  
  try {
    // Evaluate function at initial points
    let f_prev = evaluateFunction(functionExpression, x_prev);
    let f_curr = evaluateFunction(functionExpression, x_curr);
    
    while (iteration < maxIterations && !converged) {
      // Check for division by zero
      if (Math.abs(f_curr - f_prev) < 1e-10) {
        throw new Error("Division by near-zero value. Cannot continue.");
      }
      
      // Calculate next approximation using secant formula
      const x_next = x_curr - f_curr * (x_curr - x_prev) / (f_curr - f_prev);
      
      // Calculate error
      error = Math.abs(x_next - x_curr);
      
      // Store iteration data
      iterations.push({
        iteration: iteration + 1,
        x0: x_prev,
        x1: x_curr,
        fx0: f_prev,
        fx1: f_curr,
        nextX: x_next,
        error
      });
      
      // Check for convergence
      if (error < tolerance) {
        converged = true;
      }
      
      // Prepare for next iteration
      x_prev = x_curr;
      f_prev = f_curr;
      x_curr = x_next;
      f_curr = evaluateFunction(functionExpression, x_curr);
      
      iteration++;
    }
    
    const endTime = performance.now();
    
    return {
      root: x_curr,
      iterations,
      converged,
      totalIterations: iteration,
      executionTime: endTime - startTime
    };
  } catch (error) {
    throw new Error(`Secant method failed: ${error.message}`);
  }
}