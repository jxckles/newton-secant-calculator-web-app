import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Label } from './ui/label.jsx';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { newton, secant } from '../lib/numerical-methods.js';
import { evaluate, parse, derivative } from 'mathjs';
import { useToast } from './ui/use-toast.jsx';
import ComparisonPlot from './ComparisonPlot.jsx';
import ComparisonTable from './ComparisonTable.jsx';

const Comparison = () => {
  const [expression, setExpression] = useState('x^2 - 4');
  const [newtonGuess, setNewtonGuess] = useState('3');
  const [secantGuess1, setSecantGuess1] = useState('3');
  const [secantGuess2, setSecantGuess2] = useState('2');
  const [tolerance, setTolerance] = useState('0.0001');
  const [maxIterations, setMaxIterations] = useState('20');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleCompare = () => {
    try {
      setError('');
      // Parse expression to validate
      const parsedExpression = parse(expression);
      
      // Create function from expression
      const f = (x) => {
        try {
          return evaluate(expression, { x });
        } catch (e) {
          throw new Error(`Error evaluating function: ${e.message}`);
        }
      };

      // Create derivative function (for Newton-Raphson)
      const deriv = (x) => {
        try {
          const derivExpr = derivative(expression, 'x').toString();
          return evaluate(derivExpr, { x });
        } catch (e) {
          throw new Error(`Error calculating derivative: ${e.message}`);
        }
      };

      // Parse inputs
      const x0Newton = parseFloat(newtonGuess);
      const x0Secant = parseFloat(secantGuess1);
      const x1Secant = parseFloat(secantGuess2);
      const tol = parseFloat(tolerance);
      const maxIter = parseInt(maxIterations);

      if (isNaN(x0Newton)) throw new Error('Newton initial guess must be a number');
      if (isNaN(x0Secant) || isNaN(x1Secant)) throw new Error('Secant guesses must be numbers');
      if (isNaN(tol) || tol <= 0) throw new Error('Tolerance must be a positive number');
      if (isNaN(maxIter) || maxIter <= 0) throw new Error('Max iterations must be a positive integer');

      // Calculate results for both methods
      const newtonResult = newton(f, deriv, x0Newton, tol, maxIter);
      const secantResult = secant(f, x0Secant, x1Secant, tol, maxIter);

      // Combine results
      setResults({
        newton: newtonResult,
        secant: secantResult,
        expression: expression
      });

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
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compare Methods</CardTitle>
          <CardDescription>Set parameters for both Newton-Raphson and Secant methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expression">Function f(x)</Label>
              <Input 
                id="expression" 
                placeholder="e.g., x^2 - 4" 
                value={expression} 
                onChange={(e) => setExpression(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newtonGuess">Newton-Raphson Initial Guess</Label>
                <Input 
                  id="newtonGuess" 
                  type="number" 
                  value={newtonGuess} 
                  onChange={(e) => setNewtonGuess(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tolerance">Tolerance</Label>
                <Input 
                  id="tolerance" 
                  type="number" 
                  value={tolerance} 
                  onChange={(e) => setTolerance(e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secantGuess1">Secant First Guess</Label>
                <Input 
                  id="secantGuess1" 
                  type="number" 
                  value={secantGuess1} 
                  onChange={(e) => setSecantGuess1(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secantGuess2">Secant Second Guess</Label>
                <Input 
                  id="secantGuess2" 
                  type="number" 
                  value={secantGuess2} 
                  onChange={(e) => setSecantGuess2(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxIterations">Max Iterations</Label>
                <Input 
                  id="maxIterations" 
                  type="number" 
                  value={maxIterations} 
                  onChange={(e) => setMaxIterations(e.target.value)} 
                />
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}

            <Button onClick={handleCompare} className="w-full">Compare Methods</Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
              <CardDescription>
                Newton: {results.newton.iterations.length} iterations | 
                Secant: {results.secant.iterations.length} iterations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[400px]">
                <ComparisonPlot 
                  expression={results.expression}
                  newtonIterations={results.newton.iterations}
                  secantIterations={results.secant.iterations}
                />
              </div>
              <ComparisonTable 
                newtonIterations={results.newton.iterations}
                secantIterations={results.secant.iterations}
                newtonRoot={results.newton.root}
                secantRoot={results.secant.root}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Comparison;