import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Label } from './ui/label.jsx';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { newton, secant } from '../lib/numerical-methods.js';
import FunctionPlot from './FunctionPlot.jsx';
import IterationTable from './IterationTable.jsx';
import { evaluate, parse, derivative } from 'mathjs';
import { useToast } from './ui/use-toast.jsx';

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
  const { toast } = useToast();

  const handleCalculate = () => {
    try {
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
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Root Finding Method</CardTitle>
          <CardDescription>Select a method and enter the function details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="expression">Function f(x)</Label>
                <Input 
                  id="expression" 
                  placeholder="e.g., x^2 - 4" 
                  value={expression} 
                  onChange={(e) => setExpression(e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialGuess">Initial Guess (x₀)</Label>
                <Input 
                  id="initialGuess" 
                  type="number" 
                  value={initialGuess} 
                  onChange={(e) => setInitialGuess(e.target.value)} 
                />
              </div>
              {method === 'secant' && (
                <div className="space-y-2">
                  <Label htmlFor="secondGuess">Second Guess (x₁)</Label>
                  <Input 
                    id="secondGuess" 
                    type="number" 
                    value={secondGuess} 
                    onChange={(e) => setSecondGuess(e.target.value)} 
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tolerance">Tolerance (%)</Label>
                <Input 
                  id="tolerance" 
                  type="number" 
                  value={tolerance} 
                  onChange={(e) => setTolerance(e.target.value)} 
                  step="0.1"
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
              <div className="space-y-2">
                <Label htmlFor="decimalPlaces">Decimal Places</Label>
                <Input 
                  id="decimalPlaces" 
                  type="number" 
                  value={decimalPlaces} 
                  onChange={(e) => setDecimalPlaces(e.target.value)} 
                  min="1"
                  max="10"
                />
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}

            <Button onClick={handleCalculate} className="w-full">Calculate</Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
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
              <div className="h-[300px] md:h-[400px]">
                <FunctionPlot 
                  expression={expression}
                  iterations={results.iterations}
                  method={method}
                  decimalPlaces={parseInt(decimalPlaces)}
                />
              </div>
              <IterationTable 
                iterations={results.iterations} 
                method={method}
                decimalPlaces={parseInt(decimalPlaces)}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Calculator;