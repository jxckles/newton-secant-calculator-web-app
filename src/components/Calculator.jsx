import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { newton, secant } from '../lib/numerical-methods';
import FunctionPlot from './FunctionPlot';
import IterationTable from './IterationTable';
import { evaluate, parse, derivative } from 'mathjs';
import { useToast } from './ui/use-toast';
import useCalculationStore from '../store/useCalculationStore';
import { auth } from '../config/firebase-config';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Calculator = () => {
  const [method, setMethod] = useState('newton');
  const [expression, setExpression] = useState('x^2 - 4');
  const [initialGuess, setInitialGuess] = useState('3');
  const [secondGuess, setSecondGuess] = useState('2');
  const [tolerance, setTolerance] = useState('0.5');
  const [maxIterations, setMaxIterations] = useState('20');
  const [decimalPlaces, setDecimalPlaces] = useState('6');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  
  const { 
    currentCalculation, 
    setCurrentCalculation, 
    saveCalculation,
    calculationHistory
  } = useCalculationStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Load saved calculation if available
  useEffect(() => {
    if (currentCalculation?.method) {
      setMethod(currentCalculation.method);
      setExpression(currentCalculation.expression);
      setInitialGuess(currentCalculation.initialGuess);
      setSecondGuess(currentCalculation.secondGuess);
      setTolerance(currentCalculation.tolerance);
      setMaxIterations(currentCalculation.maxIterations);
      setDecimalPlaces(currentCalculation.decimalPlaces);
      setResults(currentCalculation.results);
    }
  }, [currentCalculation]);

  const handleCalculate = async () => {
    try {
      setIsCalculating(true);
      setError('');
      const parsedExpression = parse(expression);
      
      const f = (x) => {
        try {
          return evaluate(expression, { x });
        } catch (e) {
          throw new Error(`Error evaluating function: ${e.message}`);
        }
      };

      const deriv = (x) => {
        try {
          const derivExpr = derivative(expression, 'x').toString();
          return evaluate(derivExpr, { x });
        } catch (e) {
          throw new Error(`Error calculating derivative: ${e.message}`);
        }
      };

      const x0 = parseFloat(initialGuess);
      const x1 = parseFloat(secondGuess);
      const tol = parseFloat(tolerance);
      const maxIter = parseInt(maxIterations);
      const dp = parseInt(decimalPlaces);

      if (isNaN(x0)) throw new Error('Initial guess must be a number');
      if (method === 'secant' && isNaN(x1)) throw new Error('Second guess must be a number');
      if (isNaN(tol) || tol <= 0) throw new Error('Tolerance must be a positive number');
      if (isNaN(maxIter) || maxIter <= 0) throw new Error('Max iterations must be a positive integer');
      if (isNaN(dp) || dp < 0) throw new Error('Decimal places must be a non-negative integer');

      let result;
      if (method === 'newton') {
        result = newton(f, deriv, x0, tol, maxIter, dp);
      } else {
        result = secant(f, x0, x1, tol, maxIter, dp);
      }

      setResults(result);
      
      // Prepare calculation data for saving
      const calculationData = {
        type: 'single',
        method,
        expression,
        initialGuess,
        secondGuess,
        tolerance,
        maxIterations,
        decimalPlaces,
        results: result,
        timestamp: new Date().toISOString()
      };
      
      // Save to store and Firebase
      setCurrentCalculation(calculationData);
      if (auth.currentUser) {
        await saveCalculation(`calc_${Date.now()}`);
      }

      toast({
        title: 'Calculation completed',
        description: `Root found: ${result.root}`,
      });
    } catch (e) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Calculation error',
        description: e.message,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLoadFromHistory = (calc) => {
    setCurrentCalculation(calc);
    toast({
      title: 'Calculation loaded',
      description: `Loaded ${calc.method === 'newton' ? 'Newton-Raphson' : 'Secant'} calculation`,
    });
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Root Finding Method</CardTitle>
            <CardDescription>Select a method and enter the function details</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="space-y-4"
              layout
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="method">Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newton">Newton-Raphson</SelectItem>
                      <SelectItem value="secant">Secant</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="expression">Function f(x)</Label>
                  <Input 
                    id="expression" 
                    placeholder="e.g., x^2 - 4" 
                    value={expression} 
                    onChange={(e) => setExpression(e.target.value)} 
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="initialGuess">Initial Guess (x₀)</Label>
                  <Input 
                    id="initialGuess" 
                    type="number" 
                    value={initialGuess} 
                    onChange={(e) => setInitialGuess(e.target.value)} 
                  />
                </motion.div>
                <AnimatePresence>
                  {method === 'secant' && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Label htmlFor="secondGuess">Second Guess (x₁)</Label>
                      <Input 
                        id="secondGuess" 
                        type="number" 
                        value={secondGuess} 
                        onChange={(e) => setSecondGuess(e.target.value)} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="tolerance">Tolerance (%)</Label>
                  <Input 
                    id="tolerance" 
                    type="number" 
                    value={tolerance} 
                    onChange={(e) => setTolerance(e.target.value)} 
                    step="0.1"
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="maxIterations">Max Iterations</Label>
                  <Input 
                    id="maxIterations" 
                    type="number" 
                    value={maxIterations} 
                    onChange={(e) => setMaxIterations(e.target.value)} 
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="decimalPlaces">Decimal Places</Label>
                  <Input 
                    id="decimalPlaces" 
                    type="number" 
                    value={decimalPlaces} 
                    onChange={(e) => setDecimalPlaces(e.target.value)} 
                    min="1"
                    max="10"
                  />
                </motion.div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="text-destructive text-sm p-2 rounded-md bg-destructive/10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleCalculate} 
                  className="w-full"
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : 'Calculate'}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {results && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  Method: {method === 'newton' ? 'Newton-Raphson' : 'Secant'} | 
                  Iterations: {results.iterations.length} | 
                  Root: {results.root} | 
                  Tolerance: {tolerance}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div 
                  className="h-[300px] md:h-[400px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FunctionPlot 
                    expression={expression}
                    iterations={results.iterations}
                    method={method}
                    decimalPlaces={parseInt(decimalPlaces)}
                  />
                </motion.div>
                <IterationTable 
                  iterations={results.iterations} 
                  method={method}
                  decimalPlaces={parseInt(decimalPlaces)}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Calculator;