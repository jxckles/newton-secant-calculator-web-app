import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { createComparisonPlot } from "@/lib/visualization/plotComparison";

export default function ComparisonPlot({ newtonRaphsonIterations, secantIterations }) {
  const plotRef = useRef(null);
  
  useEffect(() => {
    if (!plotRef.current || !newtonRaphsonIterations || !secantIterations) return;
    
    const plotContainer = plotRef.current;
    
    // Clear previous plot
    while (plotContainer.firstChild) {
      plotContainer.removeChild(plotContainer.firstChild);
    }
    
    // Create new plot
    createComparisonPlot(
      plotContainer, 
      newtonRaphsonIterations, 
      secantIterations
    );
    
    // Cleanup function
    return () => {
      while (plotContainer.firstChild) {
        plotContainer.removeChild(plotContainer.firstChild);
      }
    };
  }, [newtonRaphsonIterations, secantIterations]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <div ref={plotRef} className="w-full h-[400px]"></div>
    </Card>
  );
}