import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Play, ArrowRightLeft as ArrowsRightLeft } from 'lucide-react';
import FunctionInput from '../components/FunctionInput';
import ParameterForm from '../components/ParameterForm';
import ResultDisplay from '../components/ResultDisplay';
import ComparisonChart from '../components/ComparisonChart';
import PerformanceMetrics from '../components/PerformanceMetrics';
import { useMethodContext } from '../context/MethodContext';
import { calculateNewton, calculateSecant } from '../utils/methodCalculations';

const ComparisonView = () => {
  const navigate = useNavigate();
  const { 
    functionInput, 
    initial, 
    tolerance, 
    maxIterations, 
    setResults,
    results
  } = useMethodContext();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  
  const runComparison = async () => {
    setError(null);
    setIsCalculating(true);
    
    try {
      // Calculate both methods
      const newtonResults = calculateNewton(functionInput, initial.x0, tolerance, maxIterations);
      const secantResults = calculateSecant(functionInput, initial.x0, initial.x1, tolerance, maxIterations);
      
      setResults({
        newton: newtonResults,
        secant: secantResults
      });
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Method Comparison</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Input Parameters</h2>
            
            <FunctionInput />
            
            <div className="my-6 space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Newton-Raphson Parameters
                </h3>
                <ParameterForm method="newton" compact />
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Secant Parameters
                </h3>
                <ParameterForm method="secant" compact />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={runComparison}
                disabled={isCalculating}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    <span>Calculating</span>
                  </>
                ) : (
                  <>
                    <ArrowsRightLeft size={18} className="mr-2" />
                    <span>Compare Methods</span>
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="lg:col-span-2">
          {results && results.newton && results.secant ? (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Convergence Comparison</h2>
                <div className="h-64 md:h-80">
                  <ComparisonChart 
                    newtonData={results.newton.iterations} 
                    secantData={results.secant.iterations} 
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h2>
                <PerformanceMetrics 
                  newtonResults={results.newton} 
                  secantResults={results.secant} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Newton-Raphson Results
                  </h3>
                  <ResultDisplay results={results.newton} method="newton" compact />
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Secant Results
                  </h3>
                  <ResultDisplay results={results.secant} method="secant" compact />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-md h-full flex items-center justify-center p-10">
              <div className="text-center text-gray-500">
                <ArrowsRightLeft size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Enter parameters and run the comparison</p>
                <p className="text-sm">Results will appear here with visual comparisons and performance metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;