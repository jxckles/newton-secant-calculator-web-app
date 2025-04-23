import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNumericalMethodsContext } from "@/hooks/useNumericalMethods";
import ParameterInput from "./ParameterInput";

export default function MethodSelector() {
  const { 
    selectedMethod, 
    setSelectedMethod 
  } = useNumericalMethodsContext();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Select Method</h3>
        <p className="text-sm text-muted-foreground">
          Choose a numerical method to find the roots of your function
        </p>
      </div>
      
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={setSelectedMethod}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem 
            value="newton-raphson" 
            id="newton-raphson" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="newton-raphson" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="text-center space-y-1">
              <h4 className="font-medium">Newton-Raphson Method</h4>
              <p className="text-sm text-muted-foreground">
                Quadratic convergence, requires derivative
              </p>
            </div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="secant" 
            id="secant" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="secant" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="text-center space-y-1">
              <h4 className="font-medium">Secant Method</h4>
              <p className="text-sm text-muted-foreground">
                No derivative required, needs two initial guesses
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>
      
      {selectedMethod && <ParameterInput method={selectedMethod} />}
    </div>
  );
}