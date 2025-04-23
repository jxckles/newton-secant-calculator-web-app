/**
 * Parse and evaluate a mathematical expression
 * @param {string} expression - The mathematical expression to evaluate
 * @param {number} x - The value of x to substitute
 * @returns {number} The result of the evaluation
 */
export function evaluateExpression(expression, x) {
  try {
    // Replace common mathematical functions and constants
    const preparedExpression = expression
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/\^/g, '**')
      .replace(/PI|π/g, 'Math.PI')
      .replace(/E|e(?!\w)/g, 'Math.E');

    // eslint-disable-next-line no-new-func
    const func = new Function('x', `return ${preparedExpression}`);
    return func(x);
  } catch (error) {
    console.error('Error evaluating expression:', error);
    throw new Error('Invalid expression');
  }
}

/**
 * Calculate the derivative of a function at a point using the central difference method
 * @param {string} expression - The mathematical expression
 * @param {number} x - The point at which to calculate the derivative
 * @param {number} h - The step size (default: 0.0001)
 * @returns {number} The approximate derivative
 */
export function numericalDerivative(expression, x, h = 0.0001) {
  try {
    const fxPlusH = evaluateExpression(expression, x + h);
    const fxMinusH = evaluateExpression(expression, x - h);
    return (fxPlusH - fxMinusH) / (2 * h);
  } catch (error) {
    console.error('Error calculating numerical derivative:', error);
    throw new Error('Could not calculate derivative');
  }
}

/**
 * Newton-Raphson method for finding roots
 * @param {string} expression - The mathematical expression
 * @param {number} initialGuess - The initial guess
 * @param {number} tolerance - The convergence tolerance (default: 1e-10)
 * @param {number} maxIterations - Maximum number of iterations (default: 100)
 * @param {boolean} useNumericalDerivative - Whether to use numerical differentiation (default: true)
 * @param {string} derivativeExpression - The derivative expression (if useNumericalDerivative is false)
 * @returns {Object} The result containing root, iterations, error, and convergence history
 */
export function newtonRaphson(
  expression,
  initialGuess,
  tolerance = 1e-10,
  maxIterations = 100,
  useNumericalDerivative = true,
  derivativeExpression = ''
) {
  let x = initialGuess;
  let iter = 0;
  let error = Infinity;
  const history = [{ x, fx: evaluateExpression(expression, x), error: null, derivative: null }];

  while (error > tolerance && iter < maxIterations) {
    const fx = evaluateExpression(expression, x);
    let derivative;

    if (useNumericalDerivative) {
      derivative = numericalDerivative(expression, x);
    } else {
      derivative = evaluateExpression(derivativeExpression, x);
    }

    // Check if derivative is too close to zero
    if (Math.abs(derivative) < 1e-10) {
      return {
        root: null,
        iterations: iter,
        error: error,
        converged: false,
        message: 'Derivative too close to zero',
        history
      };
    }

    const xNew = x - fx / derivative;
    error = Math.abs(xNew - x);
    x = xNew;
    iter++;

    history.push({ x, fx: evaluateExpression(expression, x), error, derivative });
  }

  const converged = error <= tolerance;
  const message = converged 
    ? `Converged to within tolerance after ${iter} iterations` 
    : `Failed to converge after ${maxIterations} iterations`;

  return {
    root: x,
    iterations: iter,
    error: error,
    converged,
    message,
    history
  };
}

/**
 * Secant method for finding roots
 * @param {string} expression - The mathematical expression
 * @param {number} x0 - First initial guess
 * @param {number} x1 - Second initial guess
 * @param {number} tolerance - The convergence tolerance (default: 1e-10)
 * @param {number} maxIterations - Maximum number of iterations (default: 100)
 * @returns {Object} The result containing root, iterations, error, and convergence history
 */
export function secantMethod(
  expression,
  x0,
  x1,
  tolerance = 1e-10,
  maxIterations = 100
) {
  let xPrev = x0;
  let x = x1;
  let iter = 0;
  let error = Infinity;

  const fx0 = evaluateExpression(expression, x0);
  const history = [
    { x: x0, fx: fx0, error: null },
    { x: x1, fx: evaluateExpression(expression, x1), error: Math.abs(x1 - x0) }
  ];

  while (error > tolerance && iter < maxIterations) {
    const fxPrev = evaluateExpression(expression, xPrev);
    const fx = evaluateExpression(expression, x);

    // Check for division by zero
    if (Math.abs(fx - fxPrev) < 1e-10) {
      return {
        root: null,
        iterations: iter,
        error: error,
        converged: false,
        message: 'Division by zero encountered',
        history
      };
    }

    const xNew = x - fx * (x - xPrev) / (fx - fxPrev);
    error = Math.abs(xNew - x);

    xPrev = x;
    x = xNew;
    iter++;

    history.push({ x, fx: evaluateExpression(expression, x), error });
  }

  const converged = error <= tolerance;
  const message = converged 
    ? `Converged to within tolerance after ${iter} iterations` 
    : `Failed to converge after ${maxIterations} iterations`;

  return {
    root: x,
    iterations: iter,
    error: error,
    converged,
    message,
    history
  };
}

/**
 * Validate mathematical expression
 * @param {string} expression - The expression to validate
 * @returns {Object} Validation result with isValid and message properties
 */
export function validateExpression(expression) {
  if (!expression || expression.trim() === '') {
    return { isValid: false, message: 'Expression cannot be empty' };
  }

  try {
    // Test with a sample value
    evaluateExpression(expression, 1);
    evaluateExpression(expression, 0);
    evaluateExpression(expression, -1);
    return { isValid: true, message: 'Valid expression' };
  } catch (error) {
    return { isValid: false, message: 'Invalid expression: ' + error.message };
  }
}

/**
 * Generate sample points for plotting a function
 * @param {string} expression - The expression to evaluate
 * @param {number} xMin - Minimum x value
 * @param {number} xMax - Maximum x value
 * @param {number} points - Number of points to generate
 * @returns {Array} Array of {x, y} points
 */
export function generateFunctionPoints(expression, xMin, xMax, points = 100) {
  const step = (xMax - xMin) / (points - 1);
  const result = [];

  try {
    for (let i = 0; i < points; i++) {
      const x = xMin + i * step;
      const y = evaluateExpression(expression, x);
      
      // Only include finite values
      if (isFinite(y)) {
        result.push({ x, y });
      }
    }
    return result;
  } catch (error) {
    console.error('Error generating function points:', error);
    return [];
  }
}