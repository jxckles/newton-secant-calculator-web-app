import React from 'react';
import { CheckCircle, XCircle, Clock, Sigma } from 'lucide-react';

const ResultDisplay = ({ results, method, compact = false }) => {
  if (!results) return null;
  
  const { 
    root, 
    functionValue, 
    error, 
    converged, 
    iterationsCount, 
    convergenceRate 
  } = results;
  
  // Format numbers for display
  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return num.toPrecision(6);
  };
  
  // Get status color based on convergence
  const getStatusColor = () => {
    if (converged) return 'text-green-600';
    return 'text-red-600';
  };
  
  return (
    <div>
      {!compact && (
        <div className={`flex items-center mb-4 ${getStatusColor()}`}>
          {converged ? (
            <CheckCircle size={20} className="mr-2" />
          ) : (
            <XCircle size={20} className="mr-2" />
          )}
          <span className="font-medium">
            {converged 
              ? 'Method converged successfully' 
              : 'Method did not converge within the maximum iterations'}
          </span>
        </div>
      )}
      
      <div className={compact ? 'grid grid-cols-2 gap-x-4 gap-y-2' : 'space-y-3'}>
        <div>
          <span className="text-sm text-gray-500">Root (x):</span>
          <div className="font-mono font-medium">{formatNumber(root)}</div>
        </div>
        
        <div>
          <span className="text-sm text-gray-500">f(x):</span>
          <div className="font-mono font-medium">{formatNumber(functionValue)}</div>
        </div>
        
        <div>
          <span className="text-sm text-gray-500">Final Error:</span>
          <div className="font-mono font-medium">{formatNumber(error)}</div>
        </div>
        
        <div>
          <span className="text-sm text-gray-500">Iterations:</span>
          <div className="font-mono font-medium">{iterationsCount}</div>
        </div>
        
        {convergenceRate !== null && (
          <div className={compact ? 'col-span-2' : ''}>
            <span className="text-sm text-gray-500">Convergence Rate:</span>
            <div className="font-mono font-medium">{formatNumber(convergenceRate)}</div>
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Last Iterations</h3>
          <div className="bg-gray-50 p-3 rounded-md overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="pb-2 text-left">Iteration</th>
                  <th className="pb-2 text-left">x</th>
                  <th className="pb-2 text-left">f(x)</th>
                  <th className="pb-2 text-left">Error</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {results.iterations.slice(-5).map((iter) => (
                  <tr key={iter.iteration} className="border-t border-gray-200">
                    <td className="py-1.5">{iter.iteration}</td>
                    <td className="py-1.5">{formatNumber(iter.x)}</td>
                    <td className="py-1.5">{formatNumber(iter.fx)}</td>
                    <td className="py-1.5">{iter.error !== null ? formatNumber(iter.error) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;