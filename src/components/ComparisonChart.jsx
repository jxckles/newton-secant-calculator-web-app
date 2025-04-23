import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ComparisonChart = ({ newtonData, secantData }) => {
  const [chartMode, setChartMode] = useState('error'); // 'error', 'value', or 'fx'
  
  if (!newtonData || !secantData) return null;
  
  // Find the maximum number of iterations to normalize the data
  const maxNewtonIter = newtonData.length;
  const maxSecantIter = secantData.length;
  const maxIter = Math.max(maxNewtonIter, maxSecantIter);
  
  // Normalize iteration indices to percentages for proper comparison
  const normalizeData = (data, maxLength) => {
    return data.map((iter, index) => ({
      percentage: (index / (maxLength - 1)) * 100,
      ...iter
    }));
  };
  
  const normalizedNewtonData = normalizeData(newtonData, maxNewtonIter);
  const normalizedSecantData = normalizeData(secantData, maxSecantIter);
  
  // Create merged data array with both methods
  const chartData = [];
  for (let i = 0; i <= 100; i += 5) {
    // Find the closest data points
    const closestNewton = normalizedNewtonData.reduce((prev, curr) => 
      Math.abs(curr.percentage - i) < Math.abs(prev.percentage - i) ? curr : prev
    );
    
    const closestSecant = normalizedSecantData.reduce((prev, curr) => 
      Math.abs(curr.percentage - i) < Math.abs(prev.percentage - i) ? curr : prev
    );
    
    chartData.push({
      percentage: i,
      newtonX: closestNewton.x,
      newtonError: closestNewton.error,
      newtonFx: Math.abs(closestNewton.fx),
      secantX: closestSecant.x,
      secantError: closestSecant.error,
      secantFx: Math.abs(closestSecant.fx)
    });
  }
  
  // Custom tooltip with proper null checks
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length < 2) return null;

    const newtonPayload = payload.find(item => item.dataKey.includes('newton'));
    const secantPayload = payload.find(item => item.dataKey.includes('secant'));
    
    const formatValue = (value) => {
      if (value === undefined || value === null) return 'N/A';
      return value.toPrecision(6);
    };

    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-medium">Progress: {label}%</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center">
            <span className="block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-sm">Newton-Raphson</span>
          </div>
          {chartMode === 'value' && (
            <p className="text-sm text-gray-600 pl-5">
              <span className="inline-block w-10">x:</span>
              <span className="font-mono">{formatValue(newtonPayload?.value)}</span>
            </p>
          )}
          {chartMode === 'error' && (
            <p className="text-sm text-gray-600 pl-5">
              <span className="inline-block w-10">Error:</span>
              <span className="font-mono">{formatValue(newtonPayload?.value)}</span>
            </p>
          )}
          {chartMode === 'fx' && (
            <p className="text-sm text-gray-600 pl-5">
              <span className="inline-block w-10">|f(x)|:</span>
              <span className="font-mono">{formatValue(newtonPayload?.value)}</span>
            </p>
          )}
          
          <div className="flex items-center mt-1">
            <span className="block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm">Secant</span>
          </div>
          {chartMode === 'value' && (
            <p className="text-sm text-gray-600 pl-5">
              <span className="inline-block w-10">x:</span>
              <span className="font-mono">{formatValue(secantPayload?.value)}</span>
            </p>
          )}
          {chartMode === 'error' && (
            <p className="text-sm text-gray-600 pl-5">
              <span className="inline-block w-10">Error:</span>
              <span className="font-mono">{formatValue(secantPayload?.value)}</span>
            </p>
          )}
          {chartMode === 'fx' && (
            <p className="text-sm text-gray-600 pl-5">
              <span className="inline-block w-10">|f(x)|:</span>
              <span className="font-mono">{formatValue(secantPayload?.value)}</span>
            </p>
          )}
        </div>
      </div>
    );
  };
  
  // Get current data keys and labels based on chart mode
  const getChartConfig = () => {
    switch (chartMode) {
      case 'value':
        return {
          newtonKey: 'newtonX',
          secantKey: 'secantX',
          yLabel: 'x value'
        };
      case 'fx':
        return {
          newtonKey: 'newtonFx',
          secantKey: 'secantFx',
          yLabel: '|f(x)|'
        };
      case 'error':
      default:
        return {
          newtonKey: 'newtonError',
          secantKey: 'secantError',
          yLabel: 'Error'
        };
    }
  };
  
  const { newtonKey, secantKey, yLabel } = getChartConfig();
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md ${chartMode === 'error' ? 'bg-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setChartMode('error')}
          >
            Error
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md ${chartMode === 'value' ? 'bg-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setChartMode('value')}
          >
            x Value
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md ${chartMode === 'fx' ? 'bg-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setChartMode('fx')}
          >
            |f(x)|
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="percentage"
            label={{ value: 'Convergence Progress (%)', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            scale={chartMode === 'error' || chartMode === 'fx' ? 'log' : 'auto'}
            domain={['auto', 'auto']}
            label={{ value: yLabel, angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={newtonKey} 
            name="Newton-Raphson" 
            stroke="#3B82F6" 
            strokeWidth={2} 
            dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 1 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey={secantKey} 
            name="Secant" 
            stroke="#10B981" 
            strokeWidth={2} 
            dot={{ stroke: '#10B981', strokeWidth: 2, r: 1 }}
            activeDot={{ r: 6 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;