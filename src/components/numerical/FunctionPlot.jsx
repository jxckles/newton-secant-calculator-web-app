import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";
import { createFunctionPlot } from "@/lib/visualization/plotFunctions";

export default function FunctionPlot() {
  const plotRef = useRef(null);
  const { 
    functionExpression, 
    results, 
    selectedMethod 
  } = useNumericalMethodsContext();
  
  useEffect(() => {
    if (!plotRef.current || !functionExpression || !results) return;
    
    const plotContainer = plotRef.current;
    
    // Clear previous plot
    while (plotContainer.firstChild) {
      plotContainer.removeChild(plotContainer.firstChild);
    }
    
    // Create new plot
    createFunctionPlot(
      plotContainer, 
      functionExpression, 
      results.iterations, 
      selectedMethod
    );
    
    // Cleanup function
    return () => {
      while (plotContainer.firstChild) {
        plotContainer.removeChild(plotContainer.firstChild);
      }
    };
  }, [functionExpression, results, selectedMethod]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <div ref={plotRef} className="w-full h-[400px]"></div>
    </Card>
  );
}