"use client"

import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export function TestCaseSelector({ testCases, onSelectTestCase }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
        <CardDescription>
          Select a test case to explore different function behaviors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {testCases.map((testCase) => (
          <Button 
            key={testCase.id}
            variant="outline" 
            className="w-full justify-between text-left h-auto py-3"
            onClick={() => onSelectTestCase(testCase)}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{testCase.name}</span>
              <span className="text-sm text-muted-foreground mt-1">f(x) = {testCase.fn}</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-70" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}