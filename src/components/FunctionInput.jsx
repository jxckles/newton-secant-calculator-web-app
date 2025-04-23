import React from 'react';
import { FunctionSquare as Function } from 'lucide-react';
import { useMethodContext } from '../context/MethodContext';

const FunctionInput = () => {
  const { functionInput, setFunctionInput } = useMethodContext();
  
  return (
    <div>
      <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-1">
        Function f(x)
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Function size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          id="function"
          value={functionInput}
          onChange={(e) => setFunctionInput(e.target.value)}
          placeholder="e.g., x^2 - 4"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Use standard math notation. Variables: x. Functions: sin, cos, tan, log, exp, etc.
      </p>
    </div>
  );
};

export default FunctionInput;