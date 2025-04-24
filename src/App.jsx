import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth } from './config/firebase-config';
import Calculator from './components/Calculator.jsx';
import Comparison from './components/Comparison.jsx';
import PredefinedTests from './components/PredefinedTests.jsx';
import { MainHeader } from './components/MainHeader.jsx';
import { MainFooter } from './components/MainFooter.jsx';
import { ModeToggle } from './components/theme/mode-toggle.jsx';
import About from './components/About.jsx';
import { Toaster } from './components/ui/toaster';
import useCalculationStore from './store/useCalculationStore';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const { loadCalculations, clearCurrentCalculation } = useCalculationStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, load their calculations
        loadCalculations();
      } else {
        // User is signed out, clear calculations
        clearCurrentCalculation();
      }
    });

    return () => unsubscribe();
  }, [loadCalculations, clearCurrentCalculation]);

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
      <Toaster />
    </div>
  );
}

export default App;