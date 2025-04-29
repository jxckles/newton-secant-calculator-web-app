export function newtonImproved(f, df, x0, {
  tol = 1e-6,          // Absolute tolerance
  maxIter = 100,
  decimalPlaces = 6,
  useRelative = false  // Set to true for relative tolerance check
} = {}) {
  const MIN_TOL = 1e-10;
  let x = x0, fx = f(x), dfx = df(x);
  let iterations = [{
    x: Number(x.toFixed(decimalPlaces)),
    fx: Number(fx.toFixed(decimalPlaces)),
    dfx: Number(dfx.toFixed(decimalPlaces))
  }];
  let iter = 0;

  while (iter < maxIter) {
    if (Math.abs(dfx) < MIN_TOL) {
      return { error: "Derivative too close to zero", iterations, converged: false };
    }

    let delta = fx / dfx;
    let xNew = x - delta;

    if (
      (!useRelative && Math.abs(delta) < tol) ||
      (useRelative && Math.abs(delta / xNew) < tol)
    ) {
      return {
        root: Number(xNew.toFixed(decimalPlaces)),
        iterations,
        converged: true,
        tolerance: tol
      };
    }

    x = xNew;
    fx = f(x);
    dfx = df(x);
    iter++;
    iterations.push({
      x: Number(x.toFixed(decimalPlaces)),
      fx: Number(fx.toFixed(decimalPlaces)),
      dfx: Number(dfx.toFixed(decimalPlaces))
    });
  }

  return {
    error: `Max iterations (${maxIter}) reached.`,
    iterations,
    converged: false
  };
}

export function secantImproved(f, x0, x1, {
  tol = 1e-6,
  maxIter = 100,
  decimalPlaces = 6,
  useRelative = false
} = {}) {
  const MIN_TOL = 1e-10;
  let xPrev = x0, x = x1, fPrev = f(xPrev), fx = f(x);
  let iterations = [
    { x: Number(xPrev.toFixed(decimalPlaces)), fx: Number(fPrev.toFixed(decimalPlaces)) },
    { x: Number(x.toFixed(decimalPlaces)), fx: Number(fx.toFixed(decimalPlaces)) }
  ];
  let iter = 0;

  while (iter < maxIter) {
    let denominator = fx - fPrev;
    if (Math.abs(denominator) < MIN_TOL) {
      return { error: "Secant division by near-zero.", iterations, converged: false };
    }

    let delta = fx * (x - xPrev) / denominator;
    let xNew = x - delta;

    if (
      (!useRelative && Math.abs(delta) < tol) ||
      (useRelative && Math.abs(delta / xNew) < tol)
    ) {
      return {
        root: Number(xNew.toFixed(decimalPlaces)),
        iterations,
        converged: true,
        tolerance: tol
      };
    }

    xPrev = x;
    fPrev = fx;
    x = xNew;
    fx = f(x);
    iter++;

    iterations.push({
      x: Number(x.toFixed(decimalPlaces)),
      fx: Number(fx.toFixed(decimalPlaces))
    });
  }

  return {
    error: `Max iterations (${maxIter}) reached.`,
    iterations,
    converged: false
  };
}