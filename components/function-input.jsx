"use client"

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { validateFunction } from '@/lib/math-utils';

export function FunctionInput({ 
  functionString, 
  onFunctionChange, 
  initialGuess, 
  setInitialGuess,
  secondGuess,
  setSecondGuess,
  maxIterations,
  setMaxIterations,
  tolerance,
  setTolerance,
  onCalculate,
  isCalculating
}) {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    onFunctionChange(value);
    
    try {
      validateFunction(value);
      setIsValid(true);
      setValidationMessage('');
    } catch (err) {
      setIsValid(false);
      setValidationMessage(err.message);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Function Input</CardTitle>
        <CardDescription>
          Enter a mathematical function to find its roots
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="function" className="text-base">f(x) =</Label>
            <div className="flex-1">
              <Input
                id="function"
                value={functionString}
                onChange={handleInputChange}
                placeholder="e.g., x^2 - 4"
                className={isValid ? "" : "border-destructive"}
              />
            </div>
          </div>
          {!isValid && (
            <p className="text-destructive text-sm">{validationMessage}</p>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full text-left">
                <p className="text-xs text-muted-foreground">
                  Use standard math notation: +, -, *, /, ^. For example: x^2 - 4, sin(x) + x^3, or e^x - 2
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Supported functions: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, 
                  exp, log, sqrt. Constants: pi, e.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initialGuess">Initial Guess (x₀)</Label>
            <Input
              id="initialGuess"
              type="number"
              value={initialGuess}
              onChange={(e) => setInitialGuess(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondGuess">Second Guess (x₁) - Secant Only</Label>
            <Input
              id="secondGuess"
              type="number"
              value={secondGuess}
              onChange={(e) => setSecondGuess(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tolerance">Tolerance</Label>
            <Input
              id="tolerance"
              type="number"
              min="0.0000001"
              max="1"
              step="0.0001"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxIterations">Max Iterations</Label>
            <Input
              id="maxIterations"
              type="number"
              min="1"
              max="100"
              step="1"
              value={maxIterations}
              onChange={(e) => setMaxIterations(Number(e.target.value))}
            />
          </div>
        </div>

        <Button 
          onClick={onCalculate} 
          disabled={!isValid || isCalculating}
          className="w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          {isCalculating ? "Calculating..." : "Calculate"}
        </Button>
      </CardContent>
    </Card>
  );
}