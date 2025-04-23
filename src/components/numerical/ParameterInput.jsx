import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";

export default function ParameterInput({ method }) {
  const { toast } = useToast();
  const { 
    parameters, 
    setParameters,
    functionExpression,
    solveEquation,
    isLoading
  } = useNumericalMethodsContext();
  
  const [errors, setErrors] = useState({});
  
  // Reset parameters when method changes
  useEffect(() => {
    // Set default parameters for each method
    if (method === "newton-raphson") {
      setParameters({
        x0: "1",
        tolerance: "0.0001",
        maxIterations: "20"
      });
    } else if (method === "secant") {
      setParameters({
        x0: "1",
        x1: "2",
        tolerance: "0.0001",
        maxIterations: "20"
      });
    }
  }, [method, setParameters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate initial guess(es)
    if (!parameters.x0 || isNaN(parseFloat(parameters.x0))) {
      newErrors.x0 = "Please enter a valid number";
    }
    
    if (method === "secant") {
      if (!parameters.x1 || isNaN(parseFloat(parameters.x1))) {
        newErrors.x1 = "Please enter a valid number";
      }
      
      if (parameters.x0 === parameters.x1) {
        newErrors.x1 = "The two initial guesses must be different";
      }
    }
    
    // Validate tolerance
    if (!parameters.tolerance || isNaN(parseFloat(parameters.tolerance)) || parseFloat(parameters.tolerance) <= 0) {
      newErrors.tolerance = "Please enter a positive number";
    }
    
    // Validate max iterations
    if (!parameters.maxIterations || isNaN(parseInt(parameters.maxIterations)) || parseInt(parameters.maxIterations) <= 0) {
      newErrors.maxIterations = "Please enter a positive integer";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSolve = () => {
    if (!validate()) return;
    
    if (!functionExpression) {
      toast({
        title: "Missing Function",
        description: "Please enter a function expression first",
        variant: "destructive",
      });
      return;
    }
    
    // Convert string parameters to numbers
    const numericParams = {
      ...parameters,
      x0: parseFloat(parameters.x0),
      tolerance: parseFloat(parameters.tolerance),
      maxIterations: parseInt(parameters.maxIterations)
    };
    
    if (method === "secant") {
      numericParams.x1 = parseFloat(parameters.x1);
    }
    
    solveEquation(method, numericParams);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Method Parameters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="x0">Initial Guess (x₀)</Label>
          <Input
            id="x0"
            name="x0"
            value={parameters.x0}
            onChange={handleChange}
            placeholder="Enter a number"
          />
          {errors.x0 && (
            <p className="text-sm text-destructive">{errors.x0}</p>
          )}
        </div>
        
        {method === "secant" && (
          <div className="space-y-2">
            <Label htmlFor="x1">Second Guess (x₁)</Label>
            <Input
              id="x1"
              name="x1"
              value={parameters.x1}
              onChange={handleChange}
              placeholder="Enter a different number"
            />
            {errors.x1 && (
              <p className="text-sm text-destructive">{errors.x1}</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="tolerance">Tolerance</Label>
          <Input
            id="tolerance"
            name="tolerance"
            value={parameters.tolerance}
            onChange={handleChange}
            placeholder="e.g., 0.0001"
          />
          {errors.tolerance && (
            <p className="text-sm text-destructive">{errors.tolerance}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxIterations">Max Iterations</Label>
          <Input
            id="maxIterations"
            name="maxIterations"
            value={parameters.maxIterations}
            onChange={handleChange}
            placeholder="e.g., 20"
          />
          {errors.maxIterations && (
            <p className="text-sm text-destructive">{errors.maxIterations}</p>
          )}
        </div>
      </div>
      
      <Button onClick={handleSolve} disabled={isLoading}>
        {isLoading ? "Calculating..." : "Solve Equation"}
      </Button>
      
      {method === "newton-raphson" && (
        <Alert>
          <AlertDescription>
            Note: This method requires that the function is differentiable. The derivative will be calculated automatically.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}