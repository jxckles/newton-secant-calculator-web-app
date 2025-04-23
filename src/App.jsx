import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Calculator from './components/Calculator.jsx';
import Comparison from './components/Comparison.jsx';
import PredefinedTests from './components/PredefinedTests.jsx';
import { MainHeader } from './components/MainHeader.jsx';
import { MainFooter } from './components/MainFooter.jsx';
import { ModeToggle } from './components/theme/mode-toggle.jsx';
import About from './components/About.jsx';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Numerical Methods</h1>
          <ModeToggle />
        </div>
        
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/tests" element={<PredefinedTests />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      
      <MainFooter />
    </div>
  );
}

export default App;