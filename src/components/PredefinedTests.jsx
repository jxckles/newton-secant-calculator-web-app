import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { newton, secant } from '../lib/numerical-methods.js';
import { evaluate, derivative } from 'mathjs';
import ComparisonPlot from './ComparisonPlot.jsx';
import ComparisonTable from './ComparisonTable.jsx';
import { useToast } from './ui/use-toast.jsx';
import { motion } from 'framer-motion';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100 
    }
  }
};

const tabVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200 
    }
  }
};

// Predefined test cases
const testCases = [
  {
    id: 'case1',
    name: 'Ideal Case',
    description: 'Well-behaved quadratic function',
    expression: 'x^2 - 4',
    newtonGuess: 3,
    secantGuess1: 3,
    secantGuess2: 2,
    expectedOutcome: 'All methods converge with Newton fastest'
  },
  {
    id: 'case2',
    name: 'Derivative Challenge',
    description: 'Function where Newton may fail with certain initial guesses',
    expression: 'x^3 - 2*x + 2',
    newtonGuess: 0,
    secantGuess1: -2,
    secantGuess2: -1,
    expectedOutcome: 'Secant may outperform Newton due to derivative issues'
  },
  {
    id: 'case3',
    name: 'Multiple Roots',
    description: 'Trigonometric function with multiple zeros',
    expression: 'sin(x)',
    newtonGuess: 3,
    secantGuess1: 3,
    secantGuess2: 3.5,
    expectedOutcome: 'Different methods may find different roots'
  },
  {
    id: 'case4',
    name: 'Convergence Stress Test',
    description: 'Exponential function testing method robustness',
    expression: 'exp(x) - x - 2',
    newtonGuess: 1,
    secantGuess1: 1,
    secantGuess2: 1.5,
    expectedOutcome: 'Highlights method robustness differences'
  }
];

const PredefinedTests = () => {
  const [activeTest, setActiveTest] = useState('case1');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runTest = (testCase) => {
    setIsLoading(true);
    
    // Simulate a brief loading time for better animation visuals
    setTimeout(() => {
      try {
        // Create function from expression
        const f = (x) => {
          return evaluate(testCase.expression, { x });
        };

        // Create derivative function (for Newton-Raphson)
        const deriv = (x) => {
          try {
            const derivExpr = derivative(testCase.expression, 'x').toString();
            return evaluate(derivExpr, { x });
          } catch (e) {
            throw new Error(`Error calculating derivative: ${e.message}`);
          }
        };

        // Run both methods
        const tol = 0.0001;
        const maxIter = 30;
        
        let newtonResult;
        try {
          newtonResult = newton(f, deriv, testCase.newtonGuess, tol, maxIter);
        } catch (e) {
          newtonResult = { root: NaN, iterations: [], error: e.message };
        }
        
        let secantResult;
        try {
          secantResult = secant(f, testCase.secantGuess1, testCase.secantGuess2, tol, maxIter);
        } catch (e) {
          secantResult = { root: NaN, iterations: [], error: e.message };
        }

        // Set results
        setResults({
          newton: newtonResult,
          secant: secantResult,
          expression: testCase.expression,
          testCase: testCase
        });

        toast({
          title: `Test "${testCase.name}" completed`,
          description: testCase.expectedOutcome,
        });
      } catch (e) {
        toast({
          variant: 'destructive',
          title: 'Test error',
          description: e.message,
        });
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Predefined Test Cases</CardTitle>
            <CardDescription>Compare method performance on specific functions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTest} onValueChange={setActiveTest}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {testCases.map((test, index) => (
                  <motion.div
                    key={test.id}
                    variants={tabVariants}
                    custom={index}
                  >
                    <TabsTrigger value={test.id} className="text-xs md:text-sm w-full">
                      {test.name}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>

              {testCases.map(test => (
                <TabsContent key={test.id} value={test.id} className="mt-4 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-semibold text-lg">{test.name}</h3>
                    <p className="text-muted-foreground">{test.description}</p>
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <p><strong>Function:</strong> f(x) = {test.expression}</p>
                    <p><strong>Newton Initial Guess:</strong> {test.newtonGuess}</p>
                    <p><strong>Secant Guesses:</strong> {test.secantGuess1}, {test.secantGuess2}</p>
                    <p><strong>Expected Outcome:</strong> {test.expectedOutcome}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                  >
                    <Button 
                      onClick={() => runTest(test)}
                      disabled={isLoading}
                      className="relative"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </motion.div>
                          <span className="opacity-0">Run Test</span>
                        </>
                      ) : (
                        "Run Test"
                      )}
                    </Button>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {results && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          key={results.testCase.id}
        >
          <Card>
            <CardHeader>
              <CardTitle>Test Results: {results.testCase.name}</CardTitle>
              <CardDescription>
                {results.newton.error ? (
                  <span className="text-destructive">Newton-Raphson failed to converge</span>
                ) : (
                  <span>Newton: {results.newton.iterations.length} iterations</span>
                )}
                {' | '}
                {results.secant.error ? (
                  <span className="text-destructive">Secant method failed to converge</span>
                ) : (
                  <span>Secant: {results.secant.iterations.length} iterations</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div 
                className="h-[400px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ComparisonPlot 
                  expression={results.expression}
                  newtonIterations={results.newton.iterations || []}
                  secantIterations={results.secant.iterations || []}
                />
              </motion.div>
              {(!results.newton.error || !results.secant.error) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <ComparisonTable 
                    newtonIterations={results.newton.iterations || []}
                    secantIterations={results.secant.iterations || []}
                    newtonRoot={results.newton.root}
                    secantRoot={results.secant.root}
                    newtonError={results.newton.error}
                    secantError={results.secant.error}
                  />
                </motion.div>
              )}
              <motion.div 
                className="mt-4 p-4 bg-muted rounded-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <h3 className="font-semibold mb-2">Analysis</h3>
                <p>{results.testCase.expectedOutcome}</p>
                <p className="mt-2">
                  {(!results.newton.error && !results.secant.error) ? (
                    `In this test, ${results.newton.iterations.length < results.secant.iterations.length ? 
                      'Newton-Raphson converged faster' : 
                      'Secant method converged faster'} (${
                      Math.abs(results.newton.iterations.length - results.secant.iterations.length)
                    } iterations difference).`
                  ) : (
                    results.newton.error && results.secant.error ? 
                    'Both methods failed to converge with the given parameters.' :
                    results.newton.error ? 
                    'Newton-Raphson failed while Secant method converged successfully.' :
                    'Secant method failed while Newton-Raphson converged successfully.'
                  )}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PredefinedTests;