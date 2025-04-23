/**
 * Newton-Raphson Method for finding roots
 * @param {Function} f - Function to find the root of
 * @param {Function} df - Derivative of the function
 * @param {Number} x0 - Initial guess
 * @param {Number} tol - Tolerance as percentage (e.g., 0.5 for 0.5%)
 * @param {Number} maxIter - Maximum number of iterations
 * @param {Number} decimalPlaces - Number of decimal places for results
 * @returns {Object} Result with root and iterations
 */
export function newton(f, df, x0, tol = 0.5, maxIter = 20, decimalPlaces = 6) {
  let x = x0;
  let iter = 0;
  let fx = f(x);
  let dfx = df(x);
  
  // Convert percentage tolerance to absolute
  const tolerance = Math.abs(fx) * (tol / 100);
  
  // To store all iterations for visualization
  const iterations = [{
    x: Number(x.toFixed(decimalPlaces)),
    fx: Number(fx.toFixed(decimalPlaces)),
    dfx: Number(dfx.toFixed(decimalPlaces))
  }];
  
  while (Math.abs(fx) > tolerance && iter < maxIter) {
    if (Math.abs(dfx) < 1e-10) {
      throw new Error('Derivative is too close to zero. Method failed to converge.');
    }
    
    const delta = fx / dfx;
    x = x - delta;
    
    fx = f(x);
    dfx = df(x);
    iter++;
    
    iterations.push({
      x: Number(x.toFixed(decimalPlaces)),
      fx: Number(fx.toFixed(decimalPlaces)),
      dfx: Number(dfx.toFixed(decimalPlaces))
    });
  }
  
  if (iter >= maxIter && Math.abs(fx) > tolerance) {
    throw new Error('Maximum iterations reached. Method failed to converge.');
  }
  
  return {
    root: Number(x.toFixed(decimalPlaces)),
    iterations,
    tolerance: tolerance
  };
}

/**
 * Secant Method for finding roots
 * @param {Function} f - Function to find the root of
 * @param {Number} x0 - First initial guess
 * @param {Number} x1 - Second initial guess
 * @param {Number} tol - Tolerance as percentage (e.g., 0.5 for 0.5%)
 * @param {Number} maxIter - Maximum number of iterations
 * @param {Number} decimalPlaces - Number of decimal places for results
 * @returns {Object} Result with root and iterations
 */
export function secant(f, x0, x1, tol = 0.5, maxIter = 20, decimalPlaces = 6) {
  let x_prev = x0;
  let x = x1;
  let iter = 0;
  
  let f_prev = f(x_prev);
  let fx = f(x);
  
  // Convert percentage tolerance to absolute
  const tolerance = Math.abs(fx) * (tol / 100);
  
  // To store all iterations for visualization
  const iterations = [
    { x: Number(x_prev.toFixed(decimalPlaces)), fx: Number(f_prev.toFixed(decimalPlaces)) },
    { x: Number(x.toFixed(decimalPlaces)), fx: Number(fx.toFixed(decimalPlaces)) }
  ];
  
  while (Math.abs(fx) > tolerance && iter < maxIter) {
    if (Math.abs(fx - f_prev) < 1e-10) {
      throw new Error('Division by near-zero value. Method failed to converge.');
    }
    
    const delta = fx * (x - x_prev) / (fx - f_prev);
    x_prev = x;
    f_prev = fx;
    x = x - delta;
    fx = f(x);
    iter++;
    
    iterations.push({
      x: Number(x.toFixed(decimalPlaces)),
      fx: Number(fx.toFixed(decimalPlaces))
    });
  }
  
  if (iter >= maxIter && Math.abs(fx) > tolerance) {
    throw new Error('Maximum iterations reached. Method failed to converge.');
  }
  
  return {
    root: Number(x.toFixed(decimalPlaces)),
    iterations,
    tolerance: tolerance
  };
}