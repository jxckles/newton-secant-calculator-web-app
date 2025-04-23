import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';

const About = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Numerical Methods Explorer</CardTitle>
          <CardDescription>Understanding Root-Finding Algorithms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-2">Project Overview</h3>
            <p>
              This interactive tool demonstrates two powerful numerical methods for finding roots of mathematical functions:
              Newton-Raphson and Secant methods. It provides visual insights into how these algorithms converge to solutions.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Methods Implemented</h3>
            
            <h4 className="text-lg font-medium mt-4 mb-2">Newton-Raphson Method</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Convergence Rate: Quadratic (2)</li>
              <li>Requirements: Function and its derivative</li>
              <li>Advantages: Fastest convergence when conditions are ideal</li>
              <li>Limitations: Needs derivative, sensitive to initial guess</li>
            </ul>

            <h4 className="text-lg font-medium mt-4 mb-2">Secant Method</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Convergence Rate: Superlinear (~1.6)</li>
              <li>Requirements: Only function values</li>
              <li>Advantages: No derivatives needed</li>
              <li>Limitations: Slightly slower than Newton, needs two initial guesses</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interactive function input and parameter adjustment</li>
              <li>Real-time visualization of iteration steps</li>
              <li>Side-by-side method comparison</li>
              <li>Predefined test cases for learning</li>
              <li>Detailed convergence analysis</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Technical Implementation</h3>
            <p>
              Built with React and modern web technologies, this tool emphasizes interactive learning
              through visual feedback and real-time calculations. The implementation focuses on
              accuracy, performance, and user experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;