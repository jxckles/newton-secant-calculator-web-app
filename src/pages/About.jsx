import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">About Numerical Methods</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center mb-4 text-blue-600">
              <BookOpen size={24} className="mr-3" />
              <h2 className="text-2xl font-bold">Understanding Root-Finding Methods</h2>
            </div>
            
            <div className="prose max-w-none">
              <p>
                Root-finding methods are numerical algorithms used to find where a function equals zero (f(x) = 0). 
                These points, called roots or zeros, are often solutions to important equations in physics, engineering, 
                and other fields where exact analytical solutions may be difficult or impossible to find.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Newton-Raphson Method</h3>
              <p>
                The Newton-Raphson method is an iterative approach that uses the first derivative of a function to 
                find increasingly accurate approximations of a function's root.
              </p>
              
              <div className="my-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Formula:</h4>
                <p className="font-mono">x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>) / f'(x<sub>n</sub>)</p>
                
                <h4 className="font-medium mt-4 mb-2">Characteristics:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Quadratic convergence (fastest)</li>
                  <li>Requires function derivative</li>
                  <li>Sensitive to initial guess</li>
                  <li>May fail if derivative is zero or very small</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Secant Method</h3>
              <p>
                The Secant method approximates the derivative using the slope between two points, eliminating 
                the need to compute an actual derivative.
              </p>
              
              <div className="my-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Formula:</h4>
                <p className="font-mono">x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>) * (x<sub>n</sub> - x<sub>n-1</sub>) / (f(x<sub>n</sub>) - f(x<sub>n-1</sub>))</p>
                
                <h4 className="font-medium mt-4 mb-2">Characteristics:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Superlinear convergence (order ≈ 1.618)</li>
                  <li>No derivative required</li>
                  <li>Needs two initial guesses</li>
                  <li>Generally more robust than Newton-Raphson</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center mb-4 text-indigo-600">
              <Code size={24} className="mr-3" />
              <h2 className="text-2xl font-bold">Implementation Details</h2>
            </div>
            
            <div className="prose max-w-none">
              <p>
                This application implements both the Newton-Raphson and Secant methods for finding roots 
                of mathematical functions. It provides visualization of the convergence process and 
                metrics for comparing the performance of each method.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Function Parsing</strong>: Uses math.js to safely evaluate mathematical expressions entered by users.
                </li>
                <li>
                  <strong>Derivative Calculation</strong>: For Newton-Raphson, derivatives are calculated numerically using central difference approximation.
                </li>
                <li>
                  <strong>Iteration Tracking</strong>: Each step of the algorithm is stored with key metrics.
                </li>
                <li>
                  <strong>Convergence Visualization</strong>: Interactive charts showing how each method approaches the solution.
                </li>
                <li>
                  <strong>Comparative Analysis</strong>: Side-by-side comparison of both methods with performance metrics.
                </li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Test Cases</h3>
              <p>
                The application includes carefully selected test cases to demonstrate:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Well-behaved functions where both methods perform well</li>
                <li>Functions with challenging properties (multiple roots, inflection points)</li>
                <li>Cases where one method might outperform the other</li>
              </ul>
            </div>
          </section>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4 text-indigo-600">
              <Lightbulb size={24} className="mr-3" />
              <h2 className="text-xl font-bold">Learning Resources</h2>
            </div>
            
            <ul className="space-y-4">
              <li>
                <a href="#" className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-blue-700">Numerical Methods: Fundamentals</h3>
                  <p className="text-sm text-gray-600 mt-1">Introduction to numerical techniques for solving mathematical problems</p>
                </a>
              </li>
              <li>
                <a href="#" className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-blue-700">Advanced Root-Finding Algorithms</h3>
                  <p className="text-sm text-gray-600 mt-1">Comparative analysis of various root-finding methods</p>
                </a>
              </li>
              <li>
                <a href="#" className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-blue-700">Convergence Theory and Applications</h3>
                  <p className="text-sm text-gray-600 mt-1">Understanding how and why numerical methods converge</p>
                </a>
              </li>
            </ul>
          </section>
          
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mathematical Background</h2>
            
            <div className="prose prose-sm max-w-none">
              <h3 className="font-medium">Convergence Rate</h3>
              <p>
                For an iterative method with error e<sub>n</sub> at iteration n, if:
              </p>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm my-2">
                lim(n→∞) |e<sub>n+1</sub>| / |e<sub>n</sub>|<sup>p</sup> = C
              </div>
              <p>
                Where C is a constant and p &gt; 0, then p is the order of convergence.
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Newton-Raphson: p = 2 (quadratic)</li>
                <li>Secant: p ≈ 1.618 (golden ratio)</li>
              </ul>
              
              <div className="mt-4">
                <p className="font-medium">References:</p>
                <ul className="text-sm text-gray-600 space-y-1 mt-1">
                  <li>Burden, R.L. & Faires, J.D. (2010). Numerical Analysis.</li>
                  <li>Heath, M.T. (2018). Scientific Computing: An Introductory Survey.</li>
                </ul>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default About;