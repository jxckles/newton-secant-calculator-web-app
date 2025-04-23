import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";
import { useToast } from "@/hooks/use-toast";
import { validateFunction } from "@/lib/math/parser";

export default function FunctionInput() {
  const { toast } = useToast();
  const { 
    functionExpression, 
    setFunctionExpression,
    resetResults
  } = useNumericalMethodsContext();
  
  const [inputValue, setInputValue] = useState(functionExpression || "");
  const [error, setError] = useState("");
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };
  
  const handleApplyFunction = () => {
    if (!inputValue.trim()) {
      setError("Please enter a function expression");
      return;
    }
    
    try {
      validateFunction(inputValue);
      setFunctionExpression(inputValue);
      resetResults();
      toast({
        title: "Function Updated",
        description: `Function f(x) = ${inputValue} has been set`,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Invalid Function",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Function Input</h3>
        <p className="text-sm text-muted-foreground">
          Enter a mathematical function f(x) to find its roots
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="function">Function f(x) =</Label>
        <div className="flex gap-2">
          <Input
            id="function"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., x^2 - 4"
          />
          <Button onClick={handleApplyFunction}>Apply</Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Supported syntax: Basic operators (+, -, *, /, ^), functions (sin, cos, tan, exp, log), and constants (pi, e).
          Use 'x' as the variable.
        </AlertDescription>
      </Alert>
      
      {functionExpression && (
        <div className="p-4 bg-muted rounded-md">
          <p className="font-medium">Current function:</p>
          <p className="text-lg">f(x) = {functionExpression}</p>
        </div>
      )}
    </div>
  );
}