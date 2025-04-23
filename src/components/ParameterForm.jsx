import React from 'react';
import { useMethodContext } from '../context/MethodContext';

const ParameterForm = ({ method, compact = false }) => {
  const { initial, setInitial, tolerance, setTolerance, maxIterations, setMaxIterations } = useMethodContext();
  
  return (
    <div className={`${compact ? 'space-y-3' : 'space-y-4'}`}>
      {/* Initial guess(es) */}
      <div>
        <label htmlFor={`initial-${method}`} className="block text-sm font-medium text-gray-700 mb-1">
          {method === 'newton' ? 'Initial Guess (x₀)' : 'Initial Guesses'}
        </label>
        
        <div className={`${method === 'secant' ? 'grid grid-cols-2 gap-2' : ''}`}>
          <input
            type="number"
            id={`initial-${method}`}
            value={initial.x0}
            onChange={(e) => setInitial({ ...initial, x0: parseFloat(e.target.value) })}
            step="0.1"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          
          {method === 'secant' && (
            <input
              type="number"
              id={`initial-${method}-x1`}
              value={initial.x1}
              onChange={(e) => setInitial({ ...initial, x1: parseFloat(e.target.value) })}
              placeholder="x₁"
              step="0.1"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          )}
        </div>
      </div>
      
      {/* Only show these fields if not in compact mode */}
      {!compact && (
        <>
          {/* Tolerance */}
          <div>
            <label htmlFor={`tolerance-${method}`} className="block text-sm font-medium text-gray-700 mb-1">
              Tolerance
            </label>
            <input
              type="number"
              id={`tolerance-${method}`}
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value))}
              step="0.0001"
              min="0.0000001"
              max="0.1"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Max Iterations */}
          <div>
            <label htmlFor={`max-iterations-${method}`} className="block text-sm font-medium text-gray-700 mb-1">
              Max Iterations
            </label>
            <input
              type="number"
              id={`max-iterations-${method}`}
              value={maxIterations}
              onChange={(e) => setMaxIterations(parseInt(e.target.value))}
              min="1"
              max="100"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ParameterForm;