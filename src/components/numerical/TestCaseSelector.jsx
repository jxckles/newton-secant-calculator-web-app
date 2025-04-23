import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TEST_CASES } from "@/lib/math/testCases";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";

export default function TestCaseSelector() {
  const { 
    selectedTestCase,
    setSelectedTestCase,
    setFunctionExpression,
    resetResults
  } = useNumericalMethodsContext();
  
  const handleSelectTestCase = (value) => {
    if (value === "custom") {
      setSelectedTestCase("custom");
      return;
    }
    
    const testCase = TEST_CASES.find(tc => tc.id === value);
    if (testCase) {
      setSelectedTestCase(value);
      setFunctionExpression(testCase.function);
      resetResults();
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Test Cases</h3>
        <p className="text-sm text-muted-foreground">
          Select a predefined test case or use your own function
        </p>
      </div>
      
      <Select value={selectedTestCase} onValueChange={handleSelectTestCase}>
        <SelectTrigger>
          <SelectValue placeholder="Select a test case" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">Custom Function</SelectItem>
          {TEST_CASES.map(testCase => (
            <SelectItem key={testCase.id} value={testCase.id}>
              {testCase.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedTestCase !== "custom" && (
        <div className="p-4 bg-muted rounded-md space-y-2">
          <p className="font-medium">
            {TEST_CASES.find(tc => tc.id === selectedTestCase)?.name}
          </p>
          <p className="text-sm">
            {TEST_CASES.find(tc => tc.id === selectedTestCase)?.description}
          </p>
        </div>
      )}
    </div>
  );
}