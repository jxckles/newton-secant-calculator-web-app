import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateExpression } from '@/lib/numericalMethods';

const predefinedFunctions = [
  { label: 'x² - 4', value: 'x^2 - 4' },
  { label: 'x³ - 2x + 2', value: 'x^3 - 2*x + 2' },
  { label: 'sin(x)', value: 'sin(x)' },
  { label: 'eˣ - x - 2', value: 'exp(x) - x - 2' },
];

function FunctionForm({ 
  onSubmit, 
  requiresDerivative = false,
  requiresTwoGuesses = false
}) {
  const [expression, setExpression] = useState('x^2 - 4');
  const [derivativeExpression, setDerivativeExpression] = useState('2*x');
  const [useNumericalDerivative, setUseNumericalDerivative] = useState(true);
  const [initialGuess, setInitialGuess] = useState(1);
  const [secondGuess, setSecondGuess] = useState(2);
  const [tolerance, setTolerance] = useState(0.0000001);
  const [maxIterations, setMaxIterations] = useState(100);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate expression
    const validation = validateExpression(expression);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    // Validate derivative if provided and used
    if (requiresDerivative && !useNumericalDerivative) {
      const derivativeValidation = validateExpression(derivativeExpression);
      if (!derivativeValidation.isValid) {
        setError('Invalid derivative expression: ' + derivativeValidation.message);
        return;
      }
    }
    
    setError('');
    
    onSubmit({
      expression,
      derivativeExpression,
      useNumericalDerivative,
      initialGuess: parseFloat(initialGuess),
      secondGuess: parseFloat(secondGuess),
      tolerance: parseFloat(tolerance),
      maxIterations: parseInt(maxIterations),
    });
  };

  const handlePredefinedFunction = (funcValue) => {
    setExpression(funcValue);
    
    // Set a default derivative for common functions
    if (funcValue === 'x^2 - 4') {
      setDerivativeExpression('2*x');
    } else if (funcValue === 'x^3 - 2*x + 2') {
      setDerivativeExpression('3*x^2 - 2');
    } else if (funcValue === 'sin(x)') {
      setDerivativeExpression('cos(x)');
    } else if (funcValue === 'exp(x) - x - 2') {
      setDerivativeExpression('exp(x) - 1');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Function Input</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expression">Function Expression f(x)</Label>
            <Input 
              id="expression" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., x^2 - 4" 
            />
            <div className="text-sm text-muted-foreground">
              Use x as the variable. Supported functions: sin, cos, tan, exp, log, sqrt
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {predefinedFunctions.map((func) => (
              <Button 
                key={func.value} 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handlePredefinedFunction(func.value)}
              >
                {func.label}
              </Button>
            ))}
          </div>
          
          {requiresDerivative && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useNumericalDerivative" 
                  checked={useNumericalDerivative}
                  onCheckedChange={setUseNumericalDerivative}
                />
                <Label htmlFor="useNumericalDerivative">Use numerical derivative</Label>
              </div>
              
              {!useNumericalDerivative && (
                <div className="space-y-2">
                  <Label htmlFor="derivativeExpression">Derivative Expression f'(x)</Label>
                  <Input 
                    id="derivativeExpression" 
                    value={derivativeExpression}
                    onChange={(e) => setDerivativeExpression(e.target.value)}
                    placeholder="e.g., 2*x" 
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialGuess">Initial Guess</Label>
              <Input 
                id="initialGuess" 
                type="number" 
                value={initialGuess}
                onChange={(e) => setInitialGuess(e.target.value)}
                step="any" 
              />
            </div>
            
            {requiresTwoGuesses && (
              <div className="space-y-2">
                <Label htmlFor="secondGuess">Second Guess</Label>
                <Input 
                  id="secondGuess" 
                  type="number" 
                  value={secondGuess}
                  onChange={(e) => setSecondGuess(e.target.value)}
                  step="any" 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="tolerance">Tolerance</Label>
              <Input 
                id="tolerance" 
                type="number" 
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
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
                onChange={(e) => setMaxIterations(e.target.value)}
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
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">Calculate</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default FunctionForm;