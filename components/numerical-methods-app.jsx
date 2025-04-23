"use client"

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FunctionInput } from '@/components/function-input';
import { MethodSelector } from '@/components/method-selector';
import { ResultsView } from '@/components/results-view';
import { TestCaseSelector } from '@/components/test-case-selector';
import { testCases } from '@/lib/test-cases';
import { calculateNewtonRaphson } from '@/lib/newton-raphson';
import { calculateSecant } from '@/lib/secant';

export function NumericalMethodsApp() {
  const [functionString, setFunctionString] = useState('x^2 - 4');
  const [initialGuess, setInitialGuess] = useState(3);
  const [secondGuess, setSecondGuess] = useState(2);
  const [maxIterations, setMaxIterations] = useState(10);
  const [tolerance, setTolerance] = useState(0.0001);
  const [selectedMethods, setSelectedMethods] = useState(['newton', 'secant']);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const handleFunctionChange = (value) => {
    setFunctionString(value);
    setResults(null);
    setError(null);
  };

  const handleTestCaseSelect = (testCase) => {
    setFunctionString(testCase.fn);
    setInitialGuess(testCase.initialGuess);
    setSecondGuess(testCase.secondGuess);
    setResults(null);
    setError(null);
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setError(null);
    setResults(null);

    try {
      const newResults = {};
      
      if (selectedMethods.includes('newton')) {
        newResults.newton = calculateNewtonRaphson(
          functionString,
          initialGuess,
          tolerance,
          maxIterations
        );
      }
      
      if (selectedMethods.includes('secant')) {
        newResults.secant = calculateSecant(
          functionString,
          initialGuess,
          secondGuess,
          tolerance,
          maxIterations
        );
      }
      
      setResults(newResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <section id="about" className="prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-2">Numerical Methods Explorer</h1>
            <p>
              This interactive tool demonstrates the application of Newton-Raphson and Secant methods 
              for finding roots of mathematical functions. Compare convergence rates, iterations, 
              and error approximations between these popular numerical methods.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold" id="methods">Function & Method Setup</h2>
            
            <FunctionInput 
              functionString={functionString}
              onFunctionChange={handleFunctionChange}
              initialGuess={initialGuess}
              setInitialGuess={setInitialGuess}
              secondGuess={secondGuess}
              setSecondGuess={setSecondGuess}
              maxIterations={maxIterations}
              setMaxIterations={setMaxIterations}
              tolerance={tolerance}
              setTolerance={setTolerance}
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
            />
            
            <MethodSelector 
              selectedMethods={selectedMethods}
              setSelectedMethods={setSelectedMethods}
            />
          </section>
        </div>

        <div>
          <TestCaseSelector 
            testCases={testCases} 
            onSelectTestCase={handleTestCaseSelect} 
          />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="results" className="mt-4">
            <ResultsView results={results} type="detailed" />
          </TabsContent>
          <TabsContent value="comparison" className="mt-4">
            <ResultsView results={results} type="comparison" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}