import { createContext, useState } from "react";
import { newtonRaphson } from "@/lib/math/newtonRaphson";
import { secant } from "@/lib/math/secant";

export const NumericalMethodsContext = createContext(null);

export default function NumericalMethodsProvider({ children }) {
  const [selectedMethod, setSelectedMethod] = useState("newton-raphson");
  const [selectedTestCase, setSelectedTestCase] = useState("custom");
  const [functionExpression, setFunctionExpression] = useState("");
  const [parameters, setParameters] = useState({
    x0: "1",
    x1: "2",
    tolerance: "0.0001",
    maxIterations: "20"
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const resetResults = () => {
    setResults(null);
    setError(null);
  };
  
  const solveEquation = async (method, params) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (method === "newton-raphson") {
        result = await newtonRaphson(functionExpression, params);
      } else if (method === "secant") {
        result = await secant(functionExpression, params);
      } else {
        throw new Error("Invalid method selected");
      }
      
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const compareNumericalMethods = async (params) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Run both methods with the same parameters
      const newtonResult = await newtonRaphson(functionExpression, params);
      const secantResult = await secant(functionExpression, params);
      
      return {
        newtonRaphson: newtonResult,
        secant: secantResult
      };
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <NumericalMethodsContext.Provider
      value={{
        selectedMethod,
        setSelectedMethod,
        selectedTestCase,
        setSelectedTestCase,
        functionExpression,
        setFunctionExpression,
        parameters,
        setParameters,
        results,
        isLoading,
        error,
        resetResults,
        solveEquation,
        compareNumericalMethods
      }}
    >
      {children}
    </NumericalMethodsContext.Provider>
  );
}