import React from 'react';
import { Zap, Circle, RefreshCw, TrendingUp } from 'lucide-react';

const PerformanceMetrics = ({ newtonResults, secantResults }) => {
  // Helper function to determine the "winner" for each metric
  const determineWinner = (metric, lowerIsBetter = true) => {
    if (!newtonResults || !secantResults) return null;
    
    const newtonValue = newtonResults[metric];
    const secantValue = secantResults[metric];
    
    if (newtonValue === null || secantValue === null) return null;
    
    if (lowerIsBetter) {
      return newtonValue < secantValue ? 'newton' : 'secant';
    } else {
      return newtonValue > secantValue ? 'newton' : 'secant';
    }
  };
  
  // Format numbers for display
  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return num.toPrecision(6);
  };
  
  const iterationsWinner = determineWinner('iterationsCount');
  const errorWinner = determineWinner('error');
  const convergenceWinner = determineWinner('convergenceRate', false);
  
  // Function to get color class based on method
  const getMethodColorClass = (method) => {
    return method === 'newton' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <RefreshCw size={20} className="text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-800">Iterations to Converge</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white rounded p-3">
            <span className="text-sm text-gray-500 block mb-1">Newton</span>
            <span className="text-xl font-bold">{newtonResults?.iterationsCount || 'N/A'}</span>
          </div>
          <div className="bg-white rounded p-3">
            <span className="text-sm text-gray-500 block mb-1">Secant</span>
            <span className="text-xl font-bold">{secantResults?.iterationsCount || 'N/A'}</span>
          </div>
        </div>
        
        {iterationsWinner && (
          <div className={`text-sm rounded py-1 px-2 font-medium text-center ${getMethodColorClass(iterationsWinner)}`}>
            {iterationsWinner === 'newton' ? 'Newton-Raphson' : 'Secant'} requires fewer iterations
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Circle size={20} className="text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-800">Final Error Magnitude</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white rounded p-3">
            <span className="text-sm text-gray-500 block mb-1">Newton</span>
            <span className="text-xl font-mono font-bold">{formatNumber(newtonResults?.error)}</span>
          </div>
          <div className="bg-white rounded p-3">
            <span className="text-sm text-gray-500 block mb-1">Secant</span>
            <span className="text-xl font-mono font-bold">{formatNumber(secantResults?.error)}</span>
          </div>
        </div>
        
        {errorWinner && (
          <div className={`text-sm rounded py-1 px-2 font-medium text-center ${getMethodColorClass(errorWinner)}`}>
            {errorWinner === 'newton' ? 'Newton-Raphson' : 'Secant'} achieves smaller error
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <TrendingUp size={20} className="text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-800">Convergence Rate</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white rounded p-3">
            <span className="text-sm text-gray-500 block mb-1">Newton</span>
            <span className="text-xl font-bold">{formatNumber(newtonResults?.convergenceRate)}</span>
            <span className="text-xs text-gray-500 block mt-1">Expected: 2.0</span>
          </div>
          <div className="bg-white rounded p-3">
            <span className="text-sm text-gray-500 block mb-1">Secant</span>
            <span className="text-xl font-bold">{formatNumber(secantResults?.convergenceRate)}</span>
            <span className="text-xs text-gray-500 block mt-1">Expected: ~1.6</span>
          </div>
        </div>
        
        {convergenceWinner && (
          <div className={`text-sm rounded py-1 px-2 font-medium text-center ${getMethodColorClass(convergenceWinner)}`}>
            {convergenceWinner === 'newton' ? 'Newton-Raphson' : 'Secant'} has faster convergence rate
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMetrics;