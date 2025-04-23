import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { createConvergencePlot } from "@/lib/visualization/plotConvergence";

export default function ConvergencePlot({ iterations }) {
  const plotRef = useRef(null);
  
  useEffect(() => {
    if (!plotRef.current || !iterations || iterations.length === 0) return;
    
    const plotContainer = plotRef.current;
    
    // Clear previous plot
    while (plotContainer.firstChild) {
      plotContainer.removeChild(plotContainer.firstChild);
    }
    
    // Create new plot
    createConvergencePlot(plotContainer, iterations);
    
    // Cleanup function
    return () => {
      while (plotContainer.firstChild) {
        plotContainer.removeChild(plotContainer.firstChild);
      }
    };
  }, [iterations]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <div ref={plotRef} className="w-full h-[400px]"></div>
    </Card>
  );
}