import * as math from "mathjs";

// Safe evaluation context for mathjs
const safeEval = math.evaluate;

// Function to evaluate a mathematical expression with a given value of x
export function evaluateFunction(expression, x) {
  try {
    const scope = { x };
    return safeEval(expression, scope);
  } catch (error) {
    throw new Error(`Error evaluating function: ${error.message}`);
  }
}

// Function to validate if an expression is valid
export function validateFunction(expression) {
  try {
    // Test with a sample value
    evaluateFunction(expression, 1);
    return true;
  } catch (error) {
    throw new Error(`Invalid function expression: ${error.message}`);
  }
}

// Function to evaluate the derivative of a function at a given point
export function evaluateDerivative(expression, x, h = 1e-7) {
  try {
    // Using central difference approximation for numerical derivative
    const fxPlusH = evaluateFunction(expression, x + h);
    const fxMinusH = evaluateFunction(expression, x - h);
    return (fxPlusH - fxMinusH) / (2 * h);
  } catch (error) {
    throw new Error(`Error calculating derivative: ${error.message}`);
  }
}

// Function to get points for plotting a function within a given range
export function getFunctionPoints(expression, start, end, points = 100) {
  const result = [];
  const step = (end - start) / (points - 1);
  
  for (let i = 0; i < points; i++) {
    const x = start + i * step;
    try {
      const y = evaluateFunction(expression, x);
      // Filter out infinity and NaN values
      if (isFinite(y) && !isNaN(y)) {
        result.push({ x, y });
      }
    } catch (error) {
      // Skip points where evaluation fails
      continue;
    }
  }
  
  return result;
}

// Function to find an appropriate plotting range based on root
export function getPlotRange(root, padding = 5) {
  const center = root || 0;
  const min = center - padding;
  const max = center + padding;
  return { min, max };
}