import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Share2, Play } from 'lucide-react';
import FunctionInput from '../components/FunctionInput';
import ParameterForm from '../components/ParameterForm';
import ResultDisplay from '../components/ResultDisplay';
import ConvergencePlot from '../components/ConvergencePlot';
import { useMethodContext } from '../context/MethodContext';
import { calculateNewton, calculateSecant } from '../utils/methodCalculations';

const MethodDetail = () => {
  const { method } = useParams();
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
  
  // Validate method param
  useEffect(() => {
    if (method !== 'newton' && method !== 'secant') {
      navigate('/');
    }
  }, [method, navigate]);

  const calculateResults = async () => {
    setError(null);
    setIsCalculating(true);
    
    try {
      let methodResults;
      
      if (method === 'newton') {
        methodResults = calculateNewton(functionInput, initial.x0, tolerance, maxIterations);
      } else {
        methodResults = calculateSecant(functionInput, initial.x0, initial.x1, tolerance, maxIterations);
      }
      
      setResults(prev => ({
        ...prev,
        [method]: methodResults
      }));
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const methodTitle = method === 'newton' ? 'Newton-Raphson Method' : 'Secant Method';

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{methodTitle}</h1>
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
            
            <div className="my-6">
              <ParameterForm method={method} />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={calculateResults}
                disabled={isCalculating}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    <span>Calculating</span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-2" />
                    <span>Calculate</span>
                  </>
                )}
              </button>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 size={18} />
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
          {results && results[method] ? (
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
                <ResultDisplay results={results[method]} method={method} />
              </div>
              
              <div className="mt-4 border-t border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Convergence Plot</h3>
                <div className="h-64 md:h-80">
                  <ConvergencePlot data={results[method].iterations} />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-md h-full flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <p className="mb-2">Enter your parameters and calculate to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MethodDetail;