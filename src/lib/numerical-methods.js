// Updated numerical-methods.js with stability improvements
export function newton(f, df, x0, tol = 0.5, maxIter = 20, decimalPlaces = 6) {
  // Add minimum absolute tolerance to prevent infinite loops
  const MIN_ABSOLUTE_TOLERANCE = 1e-10;
  
  let x = x0;
  let iter = 0;
  let fx = f(x);
  let dfx = df(x);
  
  // Convert percentage tolerance to absolute, with minimum floor
  const tolerance = Math.max(Math.abs(fx) * (tol / 100), MIN_ABSOLUTE_TOLERANCE);
  
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
    throw new Error(`Maximum iterations (${maxIter}) reached. Last error: ${Math.abs(fx).toExponential(2)}`);
  }
  
  return {
    root: Number(x.toFixed(decimalPlaces)),
    iterations,
    tolerance: tolerance
  };
}

export function secant(f, x0, x1, tol = 0.5, maxIter = 20, decimalPlaces = 6) {
  const MIN_ABSOLUTE_TOLERANCE = 1e-10;
  
  let x_prev = x0;
  let x = x1;
  let iter = 0;
  
  let f_prev = f(x_prev);
  let fx = f(x);
  
  const tolerance = Math.max(Math.abs(fx) * (tol / 100), MIN_ABSOLUTE_TOLERANCE);
  
  const iterations = [
    { x: Number(x_prev.toFixed(decimalPlaces)), fx: Number(f_prev.toFixed(decimalPlaces)) },
    { x: Number(x.toFixed(decimalPlaces)), fx: Number(fx.toFixed(decimalPlaces)) }
  ];
  
  while (Math.abs(fx) > tolerance && iter < maxIter) {
    const denominator = fx - f_prev;
    if (Math.abs(denominator) < 1e-10) {
      throw new Error('Division by near-zero value. Method failed to converge.');
    }
    
    const delta = fx * (x - x_prev) / denominator;
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
    throw new Error(`Maximum iterations (${maxIter}) reached. Last error: ${Math.abs(fx).toExponential(2)}`);
  }
  
  return {
    root: Number(x.toFixed(decimalPlaces)),
    iterations,
    tolerance: tolerance
  };
}