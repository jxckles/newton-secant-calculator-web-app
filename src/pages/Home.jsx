import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Split, BarChart3, BookText } from 'lucide-react';
import MethodCard from '../components/MethodCard';
import TestCaseSelector from '../components/TestCaseSelector';

const Home = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="mb-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Numerical Methods Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover and compare different root-finding techniques with interactive visualizations and performance analytics.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <MethodCard 
            title="Newton-Raphson Method"
            description="Quadratic convergence using function value and its derivative."
            icon={<Calculator size={24} />}
            to="/method/newton"
            variants={item}
          />
          <MethodCard 
            title="Secant Method"
            description="Superlinear convergence using only function values with two initial guesses."
            icon={<Split size={24} />}
            to="/method/secant"
            variants={item}
          />
          <MethodCard 
            title="Compare Methods"
            description="Side-by-side comparison of convergence speed, accuracy, and behavior."
            icon={<BarChart3 size={24} />}
            to="/comparison"
            variants={item}
          />
        </motion.div>
      </section>

      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Cases</h2>
          <p className="text-gray-600 mb-6">
            Try these carefully selected functions to explore different behaviors and challenges of root-finding methods.
          </p>
          <TestCaseSelector />
        </div>
      </section>

      <section>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Learn the Theory</h2>
              <p className="text-gray-600">
                Understand the mathematical foundations and theoretical background of these numerical methods.
              </p>
            </div>
            <Link to="/about" className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              <BookText size={18} className="mr-2" />
              <span>Read More</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;