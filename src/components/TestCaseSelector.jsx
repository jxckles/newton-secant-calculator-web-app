import React from 'react';
import { useMethodContext } from '../context/MethodContext';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const TestCaseSelector = () => {
  const { testCases, loadTestCase } = useMethodContext();
  const navigate = useNavigate();

  const handleSelectTestCase = (index) => {
    loadTestCase(index);
    navigate('/comparison');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {testCases.map((testCase, index) => (
        <div 
          key={index}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={() => handleSelectTestCase(index)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800">{testCase.name}</h3>
            <button className="text-blue-600 hover:bg-blue-100 rounded-full p-1.5">
              <Play size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">{testCase.description}</p>
          <div className="bg-gray-100 rounded p-2 font-mono text-sm overflow-x-auto">
            f(x) = {testCase.func}
          </div>
          <div className="mt-2 text-xs text-gray-500 flex space-x-4">
            <span>x₀ = {testCase.x0}</span>
            <span>x₁ = {testCase.x1}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCaseSelector;