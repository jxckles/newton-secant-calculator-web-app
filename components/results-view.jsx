"use client"

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Info } from 'lucide-react';
import { FunctionPlot } from '@/components/function-plot';
import { IterationTable } from '@/components/iteration-table';
import { ConvergencePlot } from '@/components/convergence-plot';

export function ResultsView({ results, type }) {
  const [methodTabs, setMethodTabs] = useState([]);
  
  useEffect(() => {
    if (results) {
      setMethodTabs(Object.keys(results));
    }
  }, [results]);

  if (!results || Object.keys(results).length === 0) {
    return null;
  }

  // For comparison view
  if (type === 'comparison' && Object.keys(results).length > 1) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Method Comparison</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(results).map(([method, result]) => (
            <MethodSummaryCard 
              key={method} 
              method={method} 
              result={result} 
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Convergence Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ConvergencePlot results={results} />
          </CardContent>
        </Card>

        <ComparisonMetricsCard results={results} />
      </section>
    );
  }

  // For detailed view
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Calculation Results</h2>
      
      {methodTabs.length > 0 && (
        <Tabs defaultValue={methodTabs[0]} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            {methodTabs.map(method => (
              <TabsTrigger key={method} value={method} className="capitalize">
                {method === 'newton' ? 'Newton-Raphson' : 'Secant'}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {methodTabs.map(method => (
            <TabsContent key={method} value={method} className="space-y-6 mt-6">
              <MethodResultHeader method={method} result={results[method]} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Function Plot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FunctionPlot result={results[method]} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Iteration Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IterationTable iterations={results[method].iterations} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
}

function MethodResultHeader({ method, result }) {
  let icon, title, description, badgeVariant;
  
  if (result.converged) {
    icon = <Check className="h-5 w-5" />;
    title = "Convergence Achieved";
    description = `Root found at x = ${result.root.toFixed(6)} after ${result.iterations.length} iterations`;
    badgeVariant = "success";
  } else {
    icon = <AlertTriangle className="h-5 w-5" />;
    title = "Failed to Converge";
    description = `Maximum iterations (${result.maxIterations}) reached without achieving desired tolerance`;
    badgeVariant = "destructive";
  }
  
  return (
    <Alert variant={badgeVariant === "success" ? "default" : "destructive"}>
      <div className="flex items-start">
        {icon}
        <div className="ml-3">
          <AlertTitle className="flex items-center">
            {title}
            <Badge variant={badgeVariant} className="ml-2 capitalize">
              {method === 'newton' ? 'Newton-Raphson' : 'Secant'}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            {description}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

function MethodSummaryCard({ method, result }) {
  const methodName = method === 'newton' ? 'Newton-Raphson' : 'Secant';
  const converged = result.converged;
  const iterations = result.iterations.length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {methodName}
          <Badge 
            variant={converged ? "success" : "destructive"} 
            className="ml-2"
          >
            {converged ? 'Converged' : 'Not Converged'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-sm font-medium">Root:</div>
          <div>{converged ? result.root.toFixed(6) : 'N/A'}</div>
          
          <div className="text-sm font-medium">Iterations:</div>
          <div>{iterations}</div>
          
          <div className="text-sm font-medium">Final Error:</div>
          <div>{result.iterations[iterations - 1].error.toExponential(4)}</div>
          
          <div className="text-sm font-medium">Function Value:</div>
          <div>{result.iterations[iterations - 1].fx.toExponential(4)}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonMetricsCard({ results }) {
  // Extract methods for comparison
  const methods = Object.keys(results);
  
  if (methods.length < 2) return null;
  
  // Find the method that converged in fewer iterations
  let fasterMethod = null;
  let iterationDiff = 0;
  
  if (results.newton?.converged && results.secant?.converged) {
    const newtonIterations = results.newton.iterations.length;
    const secantIterations = results.secant.iterations.length;
    
    if (newtonIterations < secantIterations) {
      fasterMethod = 'Newton-Raphson';
      iterationDiff = secantIterations - newtonIterations;
    } else if (secantIterations < newtonIterations) {
      fasterMethod = 'Secant';
      iterationDiff = newtonIterations - secantIterations;
    }
  }
  
  // Compare final errors
  let moreAccurateMethod = null;
  if (results.newton?.converged && results.secant?.converged) {
    const newtonError = Math.abs(results.newton.iterations[results.newton.iterations.length - 1].fx);
    const secantError = Math.abs(results.secant.iterations[results.secant.iterations.length - 1].fx);
    
    if (newtonError < secantError) {
      moreAccurateMethod = 'Newton-Raphson';
    } else if (secantError < newtonError) {
      moreAccurateMethod = 'Secant';
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Analysis</AlertTitle>
          <AlertDescription>
            {!results.newton?.converged && !results.secant?.converged && (
              <p>Neither method converged for this function with the given parameters.</p>
            )}
            {results.newton?.converged && !results.secant?.converged && (
              <p>Only Newton-Raphson method converged for this function.</p>
            )}
            {!results.newton?.converged && results.secant?.converged && (
              <p>Only Secant method converged for this function.</p>
            )}
            {results.newton?.converged && results.secant?.converged && (
              <>
                <p>Both methods converged successfully.</p>
                {fasterMethod ? (
                  <p className="mt-2">
                    <strong>{fasterMethod}</strong> converged faster by <strong>{iterationDiff}</strong> iterations.
                  </p>
                ) : (
                  <p className="mt-2">Both methods required the same number of iterations to converge.</p>
                )}
                {moreAccurateMethod && (
                  <p className="mt-2">
                    <strong>{moreAccurateMethod}</strong> achieved a more accurate result (smaller final error).
                  </p>
                )}
              </>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(results).map(([method, result]) => {
            const methodName = method === 'newton' ? 'Newton-Raphson' : 'Secant';
            return (
              <div key={method} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{methodName}</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Converged:</span>
                    <span>{result.converged ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Iterations:</span>
                    <span>{result.iterations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Final Error:</span>
                    <span>{result.iterations[result.iterations.length - 1].error.toExponential(4)}</span>
                  </div>
                  {result.converged && (
                    <div className="flex justify-between">
                      <span>Root Found:</span>
                      <span>{result.root.toFixed(6)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}