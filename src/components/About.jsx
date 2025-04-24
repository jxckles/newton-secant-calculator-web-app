import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowRightCircle, BookOpen, Code, Info, LineChart, Zap } from 'lucide-react';

// Simple Badge component
const Badge = ({ children, className, variant }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variantClasses = variant === "outline" ? "border" : "";
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

const About = () => {
  const [activeMethod, setActiveMethod] = useState('newton');
  const [visible, setVisible] = useState({});

  // Animate elements as they appear
  useEffect(() => {
    const sections = ['overview', 'methods', 'features', 'tech'];
    
    const timeout = setTimeout(() => {
      setVisible({ overview: true });
      
      sections.slice(1).forEach((section, index) => {
        setTimeout(() => {
          setVisible(prev => ({ ...prev, [section]: true }));
        }, (index + 1) * 400);
      });
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  // Method comparison data
  const methodFeatures = {
    newton: {
      name: "Newton-Raphson Method",
      convergence: "Quadratic (2)",
      requirements: "Function and its derivative",
      advantages: "Fastest convergence when conditions are ideal",
      limitations: "Needs derivative, sensitive to initial guess",
      formula: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}"
    },
    secant: {
      name: "Secant Method",
      convergence: "Superlinear (~1.6)",
      requirements: "Only function values",
      advantages: "No derivatives needed",
      limitations: "Slightly slower than Newton, needs two initial guesses",
      formula: "x_{n+1} = x_n - f(x_n)\\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}"
    }
  };

  // Animation classes
  const fadeIn = (sectionName) => 
    visible[sectionName] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
  
  // Handle tab click
  const handleTabClick = (method) => {
    setActiveMethod(method);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      <Card className={`transition-all duration-700 ease-out ${fadeIn('overview')}`}>
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Info size={24} className="text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-2xl">About Numerical Methods Explorer</CardTitle>
              <CardDescription className="text-lg">Understanding Root-Finding Algorithms</CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200">Interactive</Badge>
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 hover:bg-purple-200">Educational</Badge>
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900 hover:bg-green-200">Mathematics</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className={`space-y-2 transition-all duration-700 delay-200 ${fadeIn('overview')}`}>
            <h3 className="text-xl font-semibold flex items-center">
              <BookOpen size={20} className="mr-2 text-blue-600" /> Project Overview
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This interactive tool demonstrates two powerful numerical methods for finding roots of mathematical functions: 
              Newton-Raphson and Secant methods. It provides visual insights into how these algorithms converge to solutions.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`transition-all duration-700 ease-out ${fadeIn('methods')}`}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <LineChart size={24} className="text-purple-600 dark:text-purple-400" />
            <CardTitle>Methods Implemented</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Simple tab implementation with direct click handlers */}
          <div className="w-full">
            <div className="inline-flex items-center justify-center rounded-md bg-slate-100 p-1 dark:bg-slate-800 grid grid-cols-2 mb-6 w-full">
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                  activeMethod === 'newton' 
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
                onClick={() => handleTabClick('newton')}
              >
                Newton-Raphson
              </button>
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                  activeMethod === 'secant' 
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
                onClick={() => handleTabClick('secant')}
              >
                Secant Method
              </button>
            </div>
            
            {/* Content sections */}
            <div className="space-y-4">
              {/* Newton Method Content */}
              <div className={activeMethod === 'newton' ? 'block' : 'hidden'}>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Zap size={18} className="mr-2 text-yellow-500" />
                    {methodFeatures.newton.name}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Convergence Rate:</span>
                        <p>{methodFeatures.newton.convergence}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Requirements:</span>
                        <p>{methodFeatures.newton.requirements}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Advantages:</span>
                        <p>{methodFeatures.newton.advantages}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Limitations:</span>
                        <p>{methodFeatures.newton.limitations}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-inner">
                      <div className="text-center">
                        <p className="mb-2 text-gray-600 dark:text-gray-400 text-sm">Formula:</p>
                        <div className="font-mono text-lg overflow-x-auto">
                          {methodFeatures.newton.formula}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Secant Method Content */}
              <div className={activeMethod === 'secant' ? 'block' : 'hidden'}>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Zap size={18} className="mr-2 text-yellow-500" />
                    {methodFeatures.secant.name}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Convergence Rate:</span>
                        <p>{methodFeatures.secant.convergence}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Requirements:</span>
                        <p>{methodFeatures.secant.requirements}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Advantages:</span>
                        <p>{methodFeatures.secant.advantages}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700 dark:text-purple-400">Limitations:</span>
                        <p>{methodFeatures.secant.limitations}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-inner">
                      <div className="text-center">
                        <p className="mb-2 text-gray-600 dark:text-gray-400 text-sm">Formula:</p>
                        <div className="font-mono text-lg overflow-x-auto">
                          {methodFeatures.secant.formula}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center py-3">
                <div className={`w-2 h-2 rounded-full mx-1 ${activeMethod === 'newton' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`w-2 h-2 rounded-full mx-1 ${activeMethod === 'secant' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`transition-all duration-700 ease-out ${fadeIn('features')}`}>
        <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <ArrowRightCircle size={24} className="text-green-600 dark:text-green-400" />
            <CardTitle>Features</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {[
              { icon: <BookOpen size={20} />, text: "Interactive function input and parameter adjustment" },
              { icon: <LineChart size={20} />, text: "Real-time visualization of iteration steps" },
              { icon: <ArrowRightCircle size={20} />, text: "Side-by-side method comparison" },
              { icon: <Zap size={20} />, text: "Predefined test cases for learning" },
              { icon: <Code size={20} />, text: "Detailed convergence analysis" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="mr-3 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className={`transition-all duration-700 ease-out ${fadeIn('tech')}`}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Code size={24} className="text-teal-600 dark:text-teal-400" />
            <CardTitle>Technical Implementation</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Built with React and modern web technologies, this tool emphasizes interactive learning through 
            visual feedback and real-time calculations. The implementation focuses on accuracy, performance, 
            and user experience.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {['React', 'JavaScript', 'Tailwind CSS', 'shadcn/ui', 'Chart.js'].map((tech) => (
              <Badge key={tech} className="bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-100">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;