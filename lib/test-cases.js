export const testCases = [
  {
    id: 'quadratic',
    name: 'Well-behaved Quadratic',
    fn: 'x^2 - 4',
    initialGuess: 3,
    secondGuess: 2,
    description: 'A simple quadratic function with roots at x = ±2. Both methods converge quickly.'
  },
  {
    id: 'cubic',
    name: 'Derivative Challenge',
    fn: 'x^3 - 2*x + 2',
    initialGuess: 1,
    secondGuess: 0,
    description: 'A cubic function that poses challenges for Newton-Raphson with certain initial guesses.'
  },
  {
    id: 'trigonometric',
    name: 'Trigonometric Function',
    fn: 'sin(x)',
    initialGuess: 3,
    secondGuess: 3.5,
    description: 'A sine function with multiple roots. Different methods may find different roots.'
  },
  {
    id: 'exponential',
    name: 'Convergence Stress Test',
    fn: 'e^x - x - 2',
    initialGuess: 1,
    secondGuess: 2,
    description: 'An exponential function that highlights differences in method robustness.'
  },
  {
    id: 'challenging',
    name: 'Challenging Function',
    fn: 'x^3 - 7*x^2 + 14*x - 6',
    initialGuess: 0.5,
    secondGuess: 1,
    description: 'A polynomial with multiple roots that challenges convergence.'
  }
];