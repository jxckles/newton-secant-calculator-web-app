"use client"

import { Check, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function MethodSelector({ selectedMethods, setSelectedMethods }) {
  const methods = [
    {
      id: 'newton',
      name: 'Newton-Raphson Method',
      description: 'Uses function derivatives for quadratic convergence. Fastest convergence but requires derivative calculation.',
      requirements: 'Requires function and its derivative',
      convergence: 'Quadratic (2)',
      advantages: 'Fastest convergence when close to root',
      limitations: 'Needs derivative calculation, sensitive to initial guess'
    },
    {
      id: 'secant',
      name: 'Secant Method',
      description: 'Uses two points to approximate derivatives. Good alternative when derivative is difficult to compute.',
      requirements: 'Requires only function values (no derivatives)',
      convergence: 'Superlinear (~1.6)',
      advantages: 'No derivative needed',
      limitations: 'Slower than Newton, requires two initial guesses'
    }
  ];

  const handleMethodToggle = (methodId) => {
    if (selectedMethods.includes(methodId)) {
      // Don't allow deselecting if it's the only method selected
      if (selectedMethods.length > 1) {
        setSelectedMethods(selectedMethods.filter(id => id !== methodId));
      }
    } else {
      setSelectedMethods([...selectedMethods, methodId]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {methods.map((method) => (
        <div 
          key={method.id}
          className={`border rounded-lg p-4 transition-colors ${
            selectedMethods.includes(method.id) 
              ? 'bg-secondary border-primary' 
              : 'bg-card border-border'
          }`}
        >
          <div className="flex items-start">
            <Checkbox
              id={method.id}
              checked={selectedMethods.includes(method.id)}
              onCheckedChange={() => handleMethodToggle(method.id)}
              className="mt-1"
            />
            <div className="ml-3 space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={method.id}
                  className="text-base font-medium cursor-pointer"
                >
                  {method.name}
                </Label>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Info className="h-4 w-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">{method.name}</h4>
                      <div className="text-sm">
                        <p className="text-muted-foreground">{method.description}</p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                          <div className="font-semibold">Convergence:</div>
                          <div>{method.convergence}</div>
                          <div className="font-semibold">Requirements:</div>
                          <div>{method.requirements}</div>
                          <div className="font-semibold">Advantages:</div>
                          <div>{method.advantages}</div>
                          <div className="font-semibold">Limitations:</div>
                          <div>{method.limitations}</div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <p className="text-sm text-muted-foreground">
                {method.description}
              </p>
              {selectedMethods.includes(method.id) && (
                <div className="flex items-center text-xs text-primary mt-2">
                  <Check className="h-3 w-3 mr-1" /> Selected for calculation
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}