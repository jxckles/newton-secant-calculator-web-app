import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function ResultsSummary({ results, method }) {
  const { 
    root, 
    iterations, 
    converged, 
    totalIterations, 
    executionTime 
  } = results;
  
  // Calculate convergence rate (approximately)
  const calculateConvergenceRate = () => {
    if (iterations.length < 3) return "Insufficient data";
    
    // For the last few iterations, calculate ratios of errors
    const errors = iterations.slice(-4).map(iter => Math.abs(iter.error));
    if (errors.some(e => e === 0)) return "Near exact solution";
    
    // Estimate rate using last 3 errors
    const ratio1 = Math.log(errors[2] / errors[3]) / Math.log(errors[1] / errors[2]);
    const ratio2 = Math.log(errors[1] / errors[2]) / Math.log(errors[0] / errors[1]);
    
    // Average the two estimates
    const rate = (ratio1 + ratio2) / 2;
    
    // Round to 2 decimal places
    return isNaN(rate) ? "Irregular" : rate.toFixed(2);
  };
  
  // Expected convergence rates
  const expectedRate = method === "newton-raphson" ? "2.00" : "1.62";
  const actualRate = calculateConvergenceRate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {converged ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
            ) : (
              <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
            )}
            <h3 className="text-lg font-medium">
              {converged ? "Solution Found" : "Not Converged"}
            </h3>
            <p className="text-3xl font-bold mt-2">
              {converged ? root.toFixed(6) : "—"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {converged 
                ? `Found after ${totalIterations} iterations` 
                : "Max iterations reached without convergence"}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={converged ? "default" : "outline"}>
                {converged ? "Converged" : "Not Converged"}
              </Badge>
            </div>
            <h3 className="text-lg font-medium">Performance</h3>
            <div className="space-y-2 mt-2 w-full">
              <div className="flex justify-between">
                <span>Iterations:</span>
                <span className="font-medium">{totalIterations}</span>
              </div>
              <div className="flex justify-between">
                <span>Final Error:</span>
                <span className="font-medium">
                  {converged 
                    ? iterations[iterations.length - 1].error.toExponential(4) 
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">
                  {executionTime.toFixed(2)} ms
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Convergence Rate</h3>
            <div className="mt-2 w-full space-y-2">
              <div className="flex justify-between">
                <span>Expected:</span>
                <span className="font-medium">{expectedRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Observed:</span>
                <span className="font-medium">{actualRate}</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {method === "newton-raphson" 
                  ? "Newton-Raphson typically has quadratic convergence (rate = 2)" 
                  : "Secant method typically has superlinear convergence (rate ≈ 1.62)"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}