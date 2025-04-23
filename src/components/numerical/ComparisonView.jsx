import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";
import IterationTable from "./IterationTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ComparisonPlot from "./ComparisonPlot";
import { Badge } from "@/components/ui/badge";

export default function ComparisonView() {
  const { 
    functionExpression,
    parameters,
    compareNumericalMethods,
    isLoading
  } = useNumericalMethodsContext();
  
  const [comparisonResults, setComparisonResults] = useState(null);
  const [comparisonError, setComparisonError] = useState(null);
  
  const runComparison = async () => {
    try {
      setComparisonError(null);
      const results = await compareNumericalMethods({
        x0: parseFloat(parameters.x0),
        x1: parseFloat(parameters.x1 || parameters.x0 + 1),
        tolerance: parseFloat(parameters.tolerance),
        maxIterations: parseInt(parameters.maxIterations)
      });
      setComparisonResults(results);
    } catch (error) {
      setComparisonError(error.message);
    }
  };
  
  // Reset comparison results when function changes
  useEffect(() => {
    setComparisonResults(null);
    setComparisonError(null);
  }, [functionExpression]);
  
  if (!functionExpression) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Method Comparison</h3>
        <Button onClick={runComparison} disabled={isLoading}>
          {isLoading ? "Calculating..." : "Run Comparison"}
        </Button>
      </div>
      
      {comparisonError && (
        <Card className="p-6 bg-destructive/10 border-destructive">
          <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
          <p>{comparisonError}</p>
        </Card>
      )}
      
      {isLoading && (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {comparisonResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Newton-Raphson Method
                  <Badge variant={comparisonResults.newtonRaphson.converged ? "default" : "outline"}>
                    {comparisonResults.newtonRaphson.converged ? "Converged" : "Not Converged"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.newtonRaphson.converged 
                        ? comparisonResults.newtonRaphson.root.toFixed(6) 
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Iterations</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.newtonRaphson.totalIterations}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Final Error</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.newtonRaphson.converged 
                        ? comparisonResults.newtonRaphson.iterations[
                            comparisonResults.newtonRaphson.iterations.length - 1
                          ].error.toExponential(4) 
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Execution Time</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.newtonRaphson.executionTime.toFixed(2)} ms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Secant Method
                  <Badge variant={comparisonResults.secant.converged ? "default" : "outline"}>
                    {comparisonResults.secant.converged ? "Converged" : "Not Converged"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.secant.converged 
                        ? comparisonResults.secant.root.toFixed(6) 
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Iterations</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.secant.totalIterations}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Final Error</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.secant.converged 
                        ? comparisonResults.secant.iterations[
                            comparisonResults.secant.iterations.length - 1
                          ].error.toExponential(4) 
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Execution Time</p>
                    <p className="text-lg font-medium">
                      {comparisonResults.secant.executionTime.toFixed(2)} ms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="convergencePlot" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="convergencePlot">Convergence Plot</TabsTrigger>
              <TabsTrigger value="iterationTables">Iteration Tables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="convergencePlot" className="min-h-[400px]">
              <ComparisonPlot 
                newtonRaphsonIterations={comparisonResults.newtonRaphson.iterations}
                secantIterations={comparisonResults.secant.iterations}
              />
            </TabsContent>
            
            <TabsContent value="iterationTables" className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-2">Newton-Raphson Iterations</h4>
                <IterationTable 
                  iterations={comparisonResults.newtonRaphson.iterations} 
                  method="newton-raphson" 
                />
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2">Secant Iterations</h4>
                <IterationTable 
                  iterations={comparisonResults.secant.iterations} 
                  method="secant" 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}