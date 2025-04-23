import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ConvergencePlot = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  // Format data for the chart
  const chartData = data.map(iter => ({
    iteration: iter.iteration,
    value: iter.x,
    error: iter.error !== null ? iter.error : undefined,
    fx: Math.abs(iter.fx)
  }));
  
  // Create custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">Iteration {label}</p>
          <p className="text-sm text-gray-600">
            <span className="inline-block w-12">x:</span>
            <span className="font-mono">{payload[0].value.toPrecision(6)}</span>
          </p>
          {payload[1] && payload[1].value !== undefined && (
            <p className="text-sm text-gray-600">
              <span className="inline-block w-12">Error:</span>
              <span className="font-mono">{payload[1].value.toPrecision(6)}</span>
            </p>
          )}
          {payload[2] && (
            <p className="text-sm text-gray-600">
              <span className="inline-block w-12">|f(x)|:</span>
              <span className="font-mono">{payload[2].value.toPrecision(6)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="iteration"
          label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }} 
        />
        <YAxis 
          yAxisId="left"
          label={{ value: 'x value', angle: -90, position: 'insideLeft' }} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          scale="log"
          domain={['auto', 'auto']}
          allowDataOverflow
          label={{ value: 'Error & |f(x)|', angle: 90, position: 'insideRight' }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="value" 
          name="x value" 
          stroke="#3B82F6" 
          activeDot={{ r: 6 }} 
          strokeWidth={2}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="error" 
          name="Error" 
          stroke="#F97316" 
          strokeDasharray="5 5"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="fx" 
          name="|f(x)|" 
          stroke="#10B981"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ConvergencePlot;