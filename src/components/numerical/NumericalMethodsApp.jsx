import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MethodSelector from "./MethodSelector";
import FunctionInput from "./FunctionInput";
import ResultsDisplay from "./ResultsDisplay";
import ComparisonView from "./ComparisonView";
import TestCaseSelector from "./TestCaseSelector";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";
import NumericalMethodsProvider from "@/context/NumericalMethodsContext";

function NumericalMethodsAppContent() {
  const [activeTab, setActiveTab] = useState("single");
  const { selectedMethod, selectedTestCase, functionExpression } = useNumericalMethodsContext();
  
  return (
    <div className="space-y-6">
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Numerical Methods Explorer</CardTitle>
            <CardDescription>
              Explore and compare numerical methods for finding roots of equations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">Single Method</TabsTrigger>
                <TabsTrigger value="compare">Compare Methods</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="space-y-4">
                <MethodSelector />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FunctionInput />
                  <TestCaseSelector />
                </div>
                {selectedMethod && functionExpression && <ResultsDisplay />}
              </TabsContent>
              
              <TabsContent value="compare" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FunctionInput />
                  <TestCaseSelector />
                </div>
                {functionExpression && <ComparisonView />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function NumericalMethodsApp() {
  return (
    <NumericalMethodsProvider>
      <NumericalMethodsAppContent />
    </NumericalMethodsProvider>
  );
}