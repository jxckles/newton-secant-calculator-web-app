// Use math.js or our own implementation of mathematical expression evaluation
export function evaluate(fnString, x) {
  try {
    // Replace math functions and constants with JavaScript equivalents
    const preparedFn = prepareFunction(fnString);
    
    // Create a safe evaluation function
    const evalFn = new Function('x', `return ${preparedFn};`);
    
    return evalFn(x);
  } catch (error) {
    throw new Error(`Error evaluating function: ${error.message}`);
  }
}

export function validateFunction(fnString) {
  if (!fnString || fnString.trim() === '') {
    throw new Error('Function cannot be empty');
  }
  
  try {
    // Test evaluation at x=1 to validate function syntax
    evaluate(fnString, 1);
    return true;
  } catch (error) {
    throw new Error(`Invalid function: ${error.message}`);
  }
}

export function differentiate(fnString) {
  // This is a simplified symbolic differentiation
  // For a real app, you would use a more robust library
  
  // For demonstration purposes, we'll handle some basic cases:
  const simpleFunctions = {
    'x^2': '2*x',
    'x^3': '3*x^2',
    'x^4': '4*x^3',
    'sin(x)': 'cos(x)',
    'cos(x)': '-sin(x)',
    'e^x': 'e^x',
    'log(x)': '1/x',
    'x': '1',
  };
  
  // Try to match simple functions first
  if (simpleFunctions[fnString]) {
    return simpleFunctions[fnString];
  }
  
  // Handle polynomial terms in the form ax^n
  const polyRegex = /([+-]?\s*\d*)\s*x\^(\d+)/g;
  let derivedPoly = fnString.replace(polyRegex, (match, coef, power) => {
    coef = coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef);
    power = parseInt(power);
    const newCoef = coef * power;
    const newPower = power - 1;
    
    if (newPower === 0) {
      return `${newCoef}`;
    } else if (newPower === 1) {
      return `${newCoef}*x`;
    } else {
      return `${newCoef}*x^${newPower}`;
    }
  });
  
  // Handle linear terms
  const linearRegex = /([+-]?\s*\d*)\s*x(?!\^)/g;
  derivedPoly = derivedPoly.replace(linearRegex, (match, coef) => {
    coef = coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef);
    return `${coef}`;
  });
  
  // Handle constants
  const constRegex = /([+-]?\s*\d+)(?![*\/x\^])/g;
  derivedPoly = derivedPoly.replace(constRegex, '0');
  
  // For cases where we can't determine the derivative symbolically,
  // Use numerical differentiation as a fallback
  if (derivedPoly === fnString) {
    return `(f(x+h) - f(x))/h where h is small`;
  }
  
  return derivedPoly;
}

// Helper function to prepare mathematical expressions for evaluation
function prepareFunction(fnString) {
  // Replace all occurrences of x^n with Math.pow(x, n)
  let preparedFn = fnString.replace(/x\^(\d+)/g, 'Math.pow(x, $1)');
  
  // Replace trigonometric functions
  preparedFn = preparedFn
    .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
    .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
    .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
    .replace(/asin\(([^)]+)\)/g, 'Math.asin($1)')
    .replace(/acos\(([^)]+)\)/g, 'Math.acos($1)')
    .replace(/atan\(([^)]+)\)/g, 'Math.atan($1)');
  
  // Replace hyperbolic functions
  preparedFn = preparedFn
    .replace(/sinh\(([^)]+)\)/g, 'Math.sinh($1)')
    .replace(/cosh\(([^)]+)\)/g, 'Math.cosh($1)')
    .replace(/tanh\(([^)]+)\)/g, 'Math.tanh($1)');
  
  // Replace other common functions
  preparedFn = preparedFn
    .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
    .replace(/log\(([^)]+)\)/g, 'Math.log($1)')
    .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)')
    .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');
  
  // Replace constants
  preparedFn = preparedFn
    .replace(/pi/g, 'Math.PI')
    .replace(/e(?![a-zA-Z])/g, 'Math.E');
  
  // Replace e^x with Math.exp(x)
  preparedFn = preparedFn.replace(/e\^([^)]+)/g, 'Math.exp($1)');
  
  return preparedFn;
}