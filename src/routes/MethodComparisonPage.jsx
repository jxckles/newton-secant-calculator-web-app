import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { validateExpression, newtonRaphson, secantMethod, generateFunctionPoints } from '@/lib/numericalMethods';

const testFunctions = [
  { 
    name: 'Well-behaved Function', 
    expression: 'x^2 - 4',
    derivative: '2*x',
    description: 'A simple quadratic function with roots at x = ±2',
    initialGuess: 3,
    secondGuess: 1
  },
  { 
    name: 'Derivative Challenge', 
    expression: 'x^3 - 2*x + 2',
    derivative: '3*x^2 - 2',
    description: 'A cubic function where Newton-Raphson may struggle if initial guess is near a point with zero derivative',
    initialGuess: 0,
    secondGuess: -1
  },
  { 
    name: 'Multiple Roots Scenario', 
    expression: 'sin(x)',
    derivative: 'cos(x)',
    description: 'Sine function with multiple roots. Different methods may find different roots',
    initialGuess: 3,
    secondGuess: 4
  },
  { 
    name: 'Convergence Stress Test', 
    expression: 'exp(x) - x - 2',
    derivative: 'exp(x) - 1',
    description: 'Exponential function that tests robustness of methods',
    initialGuess: 1,
    secondGuess: 2
  }
];

function MethodComparisonPage() {
  const [expression, setExpression] = useState('x^2 - 4');
  const [derivativeExpression, setDerivativeExpression] = useState('2*x');
  const [initialGuess, setInitialGuess] = useState(1);
  const [secondGuess, setSecondGuess] = useState(2);
  const [tolerance, setTolerance] = useState(0.0000001);
  const [maxIterations, setMaxIterations] = useState(100);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [selectedTab, setSelectedTab] = useState('comparison');
  const [activeTestFunction, setActiveTestFunction] = useState(0);

  const handleRunComparison = () => {
    // Validate inputs
    const validation = validateExpression(expression);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    const derivativeValidation = validateExpression(derivativeExpression);
    if (!derivativeValidation.isValid) {
      setError('Invalid derivative expression: ' + derivativeValidation.message);
      return;
    }
    
    setError('');
    
    // Run both methods
    const newtonResult = newtonRaphson(
      expression,
      initialGuess,
      tolerance,
      maxIterations,
      false, // Use the provided derivative
      derivativeExpression
    );
    
    const secantResult = secantMethod(
      expression,
      initialGuess,
      secondGuess,
      tolerance,
      maxIterations
    );
    
    // Calculate metrics
    const functionPoints = generateFunctionPoints(expression, -10, 10, 200);
    
    // Store results
    setResults({
      newton: newtonResult,
      secant: secantResult,
      expression,
      functionPoints
    });
  };

  const handleSelectTestFunction = (index) => {
    const func = testFunctions[index];
    setExpression(func.expression);
    setDerivativeExpression(func.derivative);
    setInitialGuess(func.initialGuess);
    setSecondGuess(func.secondGuess);
    setActiveTestFunction(index);
  };

  // Determine which method did better
  const getPerformanceComparison = () => {
    if (!results) return null;
    
    const { newton, secant } = results;
    
    if (!newton.converged && !secant.converged) {
      return { winner: 'none', reason: 'Both methods failed to converge' };
    }
    
    if (newton.converged && !secant.converged) {
      return { winner: 'newton', reason: 'Newton-Raphson converged but Secant method did not' };
    }
    
    if (!newton.converged && secant.converged) {
      return { winner: 'secant', reason: 'Secant method converged but Newton-Raphson did not' };
    }
    
    // Both converged, compare iterations
    if (newton.iterations < secant.iterations) {
      return { 
        winner: 'newton', 
        reason: `Newton-Raphson used ${newton.iterations} iterations compared to ${secant.iterations} for Secant method` 
      };
    } else if (secant.iterations < newton.iterations) {
      return { 
        winner: 'secant', 
        reason: `Secant method used ${secant.iterations} iterations compared to ${newton.iterations} for Newton-Raphson` 
      };
    } else {
      // Same iterations, compare final error
      if (newton.error < secant.error) {
        return { winner: 'newton', reason: 'Newton-Raphson achieved lower final error' };
      } else if (secant.error < newton.error) {
        return { winner: 'secant', reason: 'Secant method achieved lower final error' };
      } else {
        return { winner: 'tie', reason: 'Both methods performed equally well' };
      }
    }
  };

  const renderComparisonResults = () => {
    if (!results) return null;
    
    const { newton, secant } = results;
    const comparison = getPerformanceComparison();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={comparison?.winner === 'newton' ? 'border-green-500 dark:border-green-700' : ''}>
            <CardHeader>
              <CardTitle>Newton-Raphson Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Converged:</span>
                  <span>{newton.converged ? 'Yes' : 'No'}</span>
                </div>
                
                {newton.root !== null && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">Root:</span>
                      <span>{parseFloat(newton.root).toFixed(8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Iterations:</span>
                      <span>{newton.iterations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Final Error:</span>
                      <span>{parseFloat(newton.error).toExponential(4)}</span>
                    </div>
                  </>
                )}
                
                <div className="text-sm text-muted-foreground">
                  {newton.message}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={comparison?.winner === 'secant' ? 'border-green-500 dark:border-green-700' : ''}>
            <CardHeader>
              <CardTitle>Secant Method Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Converged:</span>
                  <span>{secant.converged ? 'Yes' : 'No'}</span>
                </div>
                
                {secant.root !== null && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">Root:</span>
                      <span>{parseFloat(secant.root).toFixed(8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Iterations:</span>
                      <span>{secant.iterations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Final Error:</span>
                      <span>{parseFloat(secant.error).toExponential(4)}</span>
                    </div>
                  </>
                )}
                
                <div className="text-sm text-muted-foreground">
                  {secant.message}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {comparison && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {comparison.winner === 'tie' 
                ? 'Both methods performed equally'
                : comparison.winner === 'none'
                  ? 'No winner'
                  : `${comparison.winner === 'newton' ? 'Newton-Raphson' : 'Secant method'} performed better`
              }
            </AlertTitle>
            <AlertDescription>
              {comparison.reason}
            </AlertDescription>
          </Alert>
        )}
        
        <h3 className="text-xl font-semibold mt-6">Iteration Comparison</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Iteration</TableHead>
                <TableHead>Newton x</TableHead>
                <TableHead>Newton f(x)</TableHead>
                <TableHead>Newton Error</TableHead>
                <TableHead>Secant x</TableHead>
                <TableHead>Secant f(x)</TableHead>
                <TableHead>Secant Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: Math.max(newton.history?.length || 0, secant.history?.length || 0) }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>{i}</TableCell>
                  
                  {/* Newton-Raphson data */}
                  <TableCell>
                    {newton.history && newton.history[i] 
                      ? parseFloat(newton.history[i].x).toFixed(8) 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {newton.history && newton.history[i] 
                      ? parseFloat(newton.history[i].fx).toExponential(4) 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {newton.history && newton.history[i] && newton.history[i].error !== null
                      ? parseFloat(newton.history[i].error).toExponential(4) 
                      : '-'}
                  </TableCell>
                  
                  {/* Secant method data */}
                  <TableCell>
                    {secant.history && secant.history[i] 
                      ? parseFloat(secant.history[i].x).toFixed(8) 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {secant.history && secant.history[i] 
                      ? parseFloat(secant.history[i].fx).toExponential(4) 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {secant.history && secant.history[i] && secant.history[i].error !== null
                      ? parseFloat(secant.history[i].error).toExponential(4) 
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Method Comparison</h1>
        <p className="text-muted-foreground mt-2">
          Compare the performance of Newton-Raphson and Secant methods for root-finding
        </p>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="comparison">Comparison Tool</TabsTrigger>
          <TabsTrigger value="test-cases">Standard Test Cases</TabsTrigger>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Method Comparison Setup</CardTitle>
              <CardDescription>
                Configure the function and parameters to compare both methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expression">Function Expression f(x)</Label>
                  <Input 
                    id="expression" 
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g., x^2 - 4" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="derivativeExpression">Derivative Expression f'(x)</Label>
                  <Input 
                    id="derivativeExpression" 
                    value={derivativeExpression}
                    onChange={(e) => setDerivativeExpression(e.target.value)}
                    placeholder="e.g., 2*x" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="initialGuess">Initial Guess (Both Methods)</Label>
                  <Input 
                    id="initialGuess" 
                    type="number" 
                    value={initialGuess}
                    onChange={(e) => setInitialGuess(parseFloat(e.target.value))}
                    step="any" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondGuess">Second Guess (Secant Method Only)</Label>
                  <Input 
                    id="secondGuess" 
                    type="number" 
                    value={secondGuess}
                    onChange={(e) => setSecondGuess(parseFloat(e.target.value))}
                    step="any" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tolerance">Tolerance</Label>
                  <Input 
                    id="tolerance" 
                    type="number" 
                    value={tolerance}
                    onChange={(e) => setTolerance(parseFloat(e.target.value))}
                    step="any" 
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxIterations">Max Iterations</Label>
                  <Input 
                    id="maxIterations" 
                    type="number" 
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                    min="1" 
                    max="1000" 
                  />
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleRunComparison} 
                className="w-full"
              >
                Run Comparison
              </Button>
            </CardContent>
          </Card>
          
          {results && renderComparisonResults()}
        </TabsContent>
        
        <TabsContent value="test-cases" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Standard Test Functions</h2>
              <div className="space-y-4">
                {testFunctions.map((func, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-colors hover:bg-muted ${
                      activeTestFunction === index ? 'border-primary' : ''
                    }`}
                    onClick={() => handleSelectTestFunction(index)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{func.name}</CardTitle>
                      <CardDescription>f(x) = {func.expression}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">{func.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Selected Function Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testFunctions[activeTestFunction] && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-2">{testFunctions[activeTestFunction].name}</h3>
                      <p className="text-muted-foreground mb-4">
                        {testFunctions[activeTestFunction].description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="font-medium">Function:</div>
                        <div className="bg-muted p-2 rounded font-mono">
                          f(x) = {testFunctions[activeTestFunction].expression}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <div className="font-medium">Derivative:</div>
                        <div className="bg-muted p-2 rounded font-mono">
                          f'(x) = {testFunctions[activeTestFunction].derivative}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="font-medium">Initial Guess:</div>
                          <div className="font-mono">{testFunctions[activeTestFunction].initialGuess}</div>
                        </div>
                        <div>
                          <div className="font-medium">Second Guess (Secant):</div>
                          <div className="font-mono">{testFunctions[activeTestFunction].secondGuess}</div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleRunComparison} 
                        className="w-full mt-6"
                      >
                        Run Test Function
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {results && renderComparisonResults()}
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparative Analysis</CardTitle>
              <CardDescription>
                Key insights on when to use each method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Method Selection Criteria</h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Recommended Method</TableHead>
                      <TableHead>Explanation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Derivative easily available</TableCell>
                      <TableCell>Newton-Raphson</TableCell>
                      <TableCell>When derivatives are simple to calculate, Newton-Raphson typically converges faster</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Complex derivative</TableCell>
                      <TableCell>Secant</TableCell>
                      <TableCell>Avoids the need to compute complex derivatives analytically</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Near-zero derivatives</TableCell>
                      <TableCell>Secant</TableCell>
                      <TableCell>More stable when f'(x) approaches zero at some points</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>High precision needed</TableCell>
                      <TableCell>Newton-Raphson</TableCell>
                      <TableCell>Quadratic convergence means higher precision in fewer iterations</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Poor initial guess</TableCell>
                      <TableCell>Secant</TableCell>
                      <TableCell>Often more robust when starting far from the root</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Convergence Rate Comparison</h3>
              <p>
                Newton-Raphson has quadratic convergence (order 2), meaning the error is approximately squared with each iteration.
                Secant method has superlinear convergence of order approximately 1.618 (the golden ratio).
                This explains why Newton-Raphson typically requires fewer iterations, but each iteration may be more computationally expensive
                due to the derivative calculation.
              </p>
              
              <h3 className="text-lg font-semibold mt-6">Performance Metrics</h3>
              <p>
                When comparing these methods, consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Iterations to convergence:</strong> Newton typically requires fewer iterations</li>
                <li><strong>Computational cost per iteration:</strong> Secant avoids derivative calculations</li>
                <li><strong>Robustness:</strong> Secant method is often more stable across different functions</li>
                <li><strong>Initial conditions:</strong> Newton is more sensitive to the quality of initial guess</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MethodComparisonPage;