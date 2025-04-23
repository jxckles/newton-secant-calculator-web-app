export const TEST_CASES = [
  {
    id: "well-behaved",
    name: "Well-behaved Function",
    function: "x^2 - 4",
    description: "A simple quadratic function with roots at x = ±2. Both methods should converge quickly.",
    expectedRoot: 2
  },
  {
    id: "derivative-challenge",
    name: "Derivative Challenge",
    function: "x^3 - 2*x + 2",
    description: "This function may cause issues for Newton-Raphson with certain initial guesses due to local extrema.",
    expectedRoot: -1.7693
  },
  {
    id: "multiple-roots",
    name: "Multiple Roots Scenario",
    function: "sin(x)",
    description: "The sine function has multiple roots. Which one is found depends on the initial guess.",
    expectedRoot: 0
  },
  {
    id: "convergence-stress",
    name: "Convergence Stress Test",
    function: "exp(x) - x - 2",
    description: "This function tests the robustness of each method with challenging convergence.",
    expectedRoot: 1.1461
  },
  {
    id: "polynomial",
    name: "Higher Degree Polynomial",
    function: "x^4 - x^3 - 3*x^2 + 5",
    description: "A higher degree polynomial with multiple roots to test method stability.",
    expectedRoot: -1.2470
  }
];