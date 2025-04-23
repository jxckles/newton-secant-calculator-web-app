import React, { createContext, useState, useContext } from 'react';

const MethodContext = createContext();

export const useMethodContext = () => useContext(MethodContext);

export const MethodProvider = ({ children }) => {
  const [functionInput, setFunctionInput] = useState('x^2 - 4');
  const [initial, setInitial] = useState({
    x0: 3,
    x1: 2.5, // For Secant method
  });
  const [tolerance, setTolerance] = useState(0.0001);
  const [maxIterations, setMaxIterations] = useState(20);
  const [results, setResults] = useState({
    newton: null,
    secant: null
  });

  // Predefined test cases
  const testCases = [
    { name: 'Well-behaved Function', func: 'x^2 - 4', x0: 3, x1: 2.5, description: 'Simple quadratic with good convergence' },
    { name: 'Derivative Challenge', func: 'x^3 - 2*x + 2', x0: 1, x1: 0.5, description: 'Newton may struggle with initial guess near inflection' },
    { name: 'Multiple Roots', func: 'sin(x)', x0: 3, x1: 3.5, description: 'Trigonometric function with multiple roots' },
    { name: 'Convergence Stress Test', func: 'e^x - x - 2', x0: 1, x1: 1.5, description: 'Exponential function to test method robustness' }
  ];

  const loadTestCase = (index) => {
    const testCase = testCases[index];
    setFunctionInput(testCase.func);
    setInitial({ x0: testCase.x0, x1: testCase.x1 });
  };

  return (
    <MethodContext.Provider value={{
      functionInput, setFunctionInput,
      initial, setInitial,
      tolerance, setTolerance,
      maxIterations, setMaxIterations,
      results, setResults,
      testCases, loadTestCase
    }}>
      {children}
    </MethodContext.Provider>
  );
};