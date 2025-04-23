import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";
import FunctionPlot from "./FunctionPlot";
import IterationTable from "./IterationTable";
import ConvergencePlot from "./ConvergencePlot";
import ResultsSummary from "./ResultsSummary";

export default function ResultsDisplay() {
  const { 
    results, 
    selectedMethod,
    isLoading,
    error
  } = useNumericalMethodsContext();
  
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive">
        <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
        <p>{error}</p>
      </Card>
    );
  }
  
  if (!results || Object.keys(results).length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        Results ({selectedMethod === "newton-raphson" ? "Newton-Raphson Method" : "Secant Method"})
      </h3>
      
      <ResultsSummary results={results} method={selectedMethod} />
      
      <Tabs defaultValue="plot" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="plot">Function Plot</TabsTrigger>
          <TabsTrigger value="iterations">Iterations</TabsTrigger>
          <TabsTrigger value="convergence">Convergence</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plot" className="min-h-[400px]">
          <FunctionPlot />
        </TabsContent>
        
        <TabsContent value="iterations">
          <IterationTable iterations={results.iterations} method={selectedMethod} />
        </TabsContent>
        
        <TabsContent value="convergence" className="min-h-[400px]">
          <ConvergencePlot iterations={results.iterations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}