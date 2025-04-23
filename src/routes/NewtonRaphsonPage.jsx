import { useState } from 'react';
import { newtonRaphson } from '@/lib/numericalMethods';
import FunctionForm from '@/components/FunctionForm';
import FunctionPlot from '@/components/FunctionPlot';
import ResultDisplay from '@/components/ResultDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function NewtonRaphsonPage() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const handleCalculate = (formData) => {
    const { 
      expression, 
      derivativeExpression, 
      useNumericalDerivative,
      initialGuess, 
      tolerance, 
      maxIterations 
    } = formData;
    
    setExpression(expression);
    
    const result = newtonRaphson(
      expression,
      initialGuess,
      tolerance,
      maxIterations,
      useNumericalDerivative,
      derivativeExpression
    );
    
    setResult(result);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Newton-Raphson Method</h1>
        <p className="text-muted-foreground mt-2">
          An iterative method for finding successively better approximations to the roots of a function
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="theory">Theory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FunctionForm 
              onSubmit={handleCalculate} 
              requiresDerivative={true}
            />
            
            {expression && (
              <FunctionPlot 
                expression={expression} 
                result={result} 
              />
            )}
          </div>
          
          {result && (
            <ResultDisplay result={result} methodName="Newton-Raphson" />
          )}
        </TabsContent>
        
        <TabsContent value="theory" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>The Newton-Raphson Method</CardTitle>
              <CardDescription>
                A powerful technique for finding roots of differentiable functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">How It Works</h3>
              <p>
                The Newton-Raphson method uses the first-order Taylor series approximation of a function
                to find increasingly accurate approximations of a function's root.
              </p>
              
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-lg text-center">
                  x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>) / f'(x<sub>n</sub>)
                </p>
              </div>
              
              <h3 className="text-lg font-semibold mt-4">Characteristics</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Requires the function to be differentiable</li>
                <li>Exhibits quadratic convergence when close to a root</li>
                <li>Can diverge if the initial guess is poor or if f'(x) is close to zero</li>
                <li>Finds only one root at a time</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">Geometric Interpretation</h3>
              <p>
                Each iteration of Newton's method can be visualized as drawing a tangent line to the function
                at the current guess x<sub>n</sub> and finding the x-intercept of this tangent line. This
                x-intercept becomes the next approximation x<sub>n+1</sub>.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Convergence</h3>
              <p>
                The method generally converges quadratically when:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The initial guess is sufficiently close to a root</li>
                <li>f'(x) ≠ 0 near the root</li>
                <li>f'(x) is continuous near the root</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default NewtonRaphsonPage;