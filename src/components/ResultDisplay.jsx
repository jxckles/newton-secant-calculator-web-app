import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function ResultDisplay({ result, methodName }) {
  const [activeTab, setActiveTab] = useState('summary');
  
  if (!result) {
    return null;
  }

  let statusIcon = null;
  let statusColor = '';
  
  if (result.converged) {
    statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
    statusColor = 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
  } else {
    statusIcon = <XCircle className="h-5 w-5 text-red-500" />;
    statusColor = 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{methodName} Results</span>
          {result.root !== null && (
            <Badge variant={result.converged ? 'default' : 'destructive'}>
              {result.iterations} iterations
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className={`mb-4 ${statusColor}`}>
          <div className="flex items-center gap-2">
            {statusIcon}
            <AlertTitle>
              {result.converged ? 'Success' : 'Failed to Converge'}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            {result.message}
          </AlertDescription>
        </Alert>

        {result.root !== null && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Root</div>
                <div className="text-2xl font-bold">{parseFloat(result.root).toFixed(8)}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Final Error</div>
                <div className="text-2xl font-bold">{parseFloat(result.error).toExponential(4)}</div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="iterations">Iterations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="py-2">
                <div className="space-y-2">
                  <p><strong>Method:</strong> {methodName}</p>
                  <p><strong>Iterations:</strong> {result.iterations}</p>
                  <p><strong>Convergence:</strong> {result.converged ? 'Yes' : 'No'}</p>
                  {result.error && <p><strong>Final Error:</strong> {parseFloat(result.error).toExponential(8)}</p>}
                </div>
              </TabsContent>
              
              <TabsContent value="iterations">
                <div className="max-h-80 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Iteration</TableHead>
                        <TableHead>x</TableHead>
                        <TableHead>f(x)</TableHead>
                        <TableHead>Error</TableHead>
                        {result.history[0].derivative !== undefined && (
                          <TableHead>f'(x)</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.history.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index}</TableCell>
                          <TableCell>{parseFloat(item.x).toFixed(8)}</TableCell>
                          <TableCell>{parseFloat(item.fx).toExponential(4)}</TableCell>
                          <TableCell>
                            {item.error !== null 
                              ? parseFloat(item.error).toExponential(4) 
                              : '-'}
                          </TableCell>
                          {item.derivative !== undefined && (
                            <TableCell>
                              {item.derivative !== null 
                                ? parseFloat(item.derivative).toExponential(4) 
                                : '-'}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResultDisplay;