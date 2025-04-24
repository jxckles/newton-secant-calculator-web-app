import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { newton, secant } from '../lib/numerical-methods';
import { evaluate, parse, derivative } from 'mathjs';
import { useToast } from './ui/use-toast';
import ComparisonPlot from './ComparisonPlot';
import ComparisonTable from './ComparisonTable';
import useCalculationStore from '../store/useCalculationStore';
import { auth } from '../config/firebase-config';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Comparison = () => {
  const [expression, setExpression] = useState('x^2 - 4');
  const [newtonGuess, setNewtonGuess] = useState('3');
  const [secantGuess1, setSecantGuess1] = useState('3');
  const [secantGuess2, setSecantGuess2] = useState('2');
  const [tolerancePercentage, setTolerancePercentage] = useState('0.5');
  const [significantDecimals, setSignificantDecimals] = useState('4');
  const [maxIterations, setMaxIterations] = useState('20');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isComparing, setIsComparing] = useState(false);
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

  // Load saved comparison if available
  useEffect(() => {
    if (currentCalculation?.type === 'comparison') {
      setExpression(currentCalculation.expression);
      setNewtonGuess(currentCalculation.newtonGuess);
      setSecantGuess1(currentCalculation.secantGuess1);
      setSecantGuess2(currentCalculation.secantGuess2);
      setTolerancePercentage(currentCalculation.tolerancePercentage || '0.01');
      setSignificantDecimals(currentCalculation.significantDecimals || '4');
      setMaxIterations(currentCalculation.maxIterations);
      setResults(currentCalculation.results);
    }
  }, [currentCalculation]);

  const handleCompare = async () => {
    try {
      setIsComparing(true);
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

      const x0Newton = parseFloat(newtonGuess);
      const x0Secant = parseFloat(secantGuess1);
      const x1Secant = parseFloat(secantGuess2);
      const tolPercentage = parseFloat(tolerancePercentage);
      const decimals = parseInt(significantDecimals);
      const maxIter = parseInt(maxIterations);

      if (isNaN(x0Newton)) throw new Error('Newton initial guess must be a number');
      if (isNaN(x0Secant) || isNaN(x1Secant)) throw new Error('Secant guesses must be numbers');
      if (isNaN(tolPercentage) || tolPercentage <= 0) throw new Error('Tolerance must be a positive percentage');
      if (isNaN(decimals) || decimals < 0) throw new Error('Significant decimals must be a non-negative integer');
      if (isNaN(maxIter) || maxIter <= 0) throw new Error('Max iterations must be a positive integer');

      // Convert percentage tolerance to absolute value
      const tol = Math.pow(10, -decimals) * (tolPercentage / 100);

      const newtonResult = newton(f, deriv, x0Newton, tol, maxIter);
      const secantResult = secant(f, x0Secant, x1Secant, tol, maxIter);

      const comparisonResults = {
        newton: newtonResult,
        secant: secantResult,
        expression: expression,
        tolerancePercentage: tolPercentage,
        significantDecimals: decimals
      };

      setResults(comparisonResults);
      
      // Prepare comparison data for saving
      const comparisonData = {
        type: 'comparison',
        expression,
        newtonGuess,
        secantGuess1,
        secantGuess2,
        tolerancePercentage: tolPercentage.toString(),
        significantDecimals: decimals.toString(),
        maxIterations,
        results: comparisonResults,
        timestamp: new Date().toISOString()
      };
      
      // Save to store and Firebase
      setCurrentCalculation(comparisonData);
      if (auth.currentUser) {
        await saveCalculation(`comp_${Date.now()}`);
      }

      toast({
        title: 'Comparison completed',
        description: `Newton: ${newtonResult.iterations.length} iterations, Secant: ${secantResult.iterations.length} iterations`,
      });
    } catch (e) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Calculation error',
        description: e.message,
      });
    } finally {
      setIsComparing(false);
    }
  };

  const handleLoadFromHistory = (comp) => {
    setCurrentCalculation(comp);
    toast({
      title: 'Comparison loaded',
      description: 'Loaded comparison between Newton and Secant methods',
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
            <CardTitle>Compare Methods</CardTitle>
            <CardDescription>Set parameters for both Newton-Raphson and Secant methods</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div className="space-y-4" layout>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="newtonGuess">Newton-Raphson Initial Guess</Label>
                  <Input 
                    id="newtonGuess" 
                    type="number" 
                    value={newtonGuess} 
                    onChange={(e) => setNewtonGuess(e.target.value)} 
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="tolerancePercentage">Tolerance (%)</Label>
                  <Input 
                    id="tolerancePercentage" 
                    type="number" 
                    step="0.01"
                    value={tolerancePercentage} 
                    onChange={(e) => setTolerancePercentage(e.target.value)} 
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="secantGuess1">Secant First Guess</Label>
                  <Input 
                    id="secantGuess1" 
                    type="number" 
                    value={secantGuess1} 
                    onChange={(e) => setSecantGuess1(e.target.value)} 
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="secantGuess2">Secant Second Guess</Label>
                  <Input 
                    id="secantGuess2" 
                    type="number" 
                    value={secantGuess2} 
                    onChange={(e) => setSecantGuess2(e.target.value)} 
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="significantDecimals">Significant Decimal Places</Label>
                  <Input 
                    id="significantDecimals" 
                    type="number" 
                    min="1"
                    max="15"
                    value={significantDecimals} 
                    onChange={(e) => setSignificantDecimals(e.target.value)} 
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
                  onClick={handleCompare} 
                  className="w-full"
                  disabled={isComparing}
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Comparing...
                    </>
                  ) : 'Compare Methods'}
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
                <CardTitle>Comparison Results</CardTitle>
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
                  {' | '}
                  Tolerance: {results.tolerancePercentage}% | 
                  Decimals: {results.significantDecimals}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="h-[400px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ComparisonPlot 
                    expression={results.expression}
                    newtonIterations={results.newton.iterations}
                    secantIterations={results.secant.iterations}
                  />
                </motion.div>
                <ComparisonTable 
                  newtonIterations={results.newton.iterations}
                  secantIterations={results.secant.iterations}
                  newtonRoot={results.newton.root}
                  secantRoot={results.secant.root}
                  significantDecimals={results.significantDecimals}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Comparison;