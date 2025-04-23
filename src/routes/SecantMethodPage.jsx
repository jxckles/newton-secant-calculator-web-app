import { useState } from 'react';
import { secantMethod } from '@/lib/numericalMethods';
import FunctionForm from '@/components/FunctionForm';
import FunctionPlot from '@/components/FunctionPlot';
import ResultDisplay from '@/components/ResultDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function SecantMethodPage() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const handleCalculate = (formData) => {
    const { 
      expression, 
      initialGuess, 
      secondGuess,
      tolerance, 
      maxIterations 
    } = formData;
    
    setExpression(expression);
    
    const result = secantMethod(
      expression,
      initialGuess,
      secondGuess,
      tolerance,
      maxIterations
    );
    
    setResult(result);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Secant Method</h1>
        <p className="text-muted-foreground mt-2">
          A root-finding algorithm that uses a secant line through two points to approximate the root
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
              requiresTwoGuesses={true}
            />
            
            {expression && (
              <FunctionPlot 
                expression={expression} 
                result={result} 
              />
            )}
          </div>
          
          {result && (
            <ResultDisplay result={result} methodName="Secant Method" />
          )}
        </TabsContent>
        
        <TabsContent value="theory" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>The Secant Method</CardTitle>
              <CardDescription>
                An iterative root-finding method that doesn't require derivatives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">How It Works</h3>
              <p>
                The secant method approximates the derivative used in Newton's method by using the slope of a secant line
                through the two most recent approximations.
              </p>
              
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-lg text-center">
                  x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>) · (x<sub>n</sub> - x<sub>n-1</sub>) / (f(x<sub>n</sub>) - f(x<sub>n-1</sub>))
                </p>
              </div>
              
              <h3 className="text-lg font-semibold mt-4">Characteristics</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Does not require computing derivatives</li>
                <li>Requires two initial points instead of one</li>
                <li>Converges with order approximately 1.618 (the golden ratio)</li>
                <li>Can be more stable than Newton's method in some cases</li>
                <li>Can fail if the secant becomes nearly horizontal</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">Geometric Interpretation</h3>
              <p>
                The secant method draws a straight line (secant) through the two most recent points on the function curve
                and uses the x-intercept of this line as the next approximation.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Comparison to Newton's Method</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Slower convergence (superlinear vs. quadratic)</li>
                <li>No need to compute or provide derivatives</li>
                <li>Requires two initial points instead of one</li>
                <li>Sometimes more stable when derivatives are close to zero</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SecantMethodPage;