import React from 'react';
import { FunctionSquare as Functions } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils.js';

export function MainHeader() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Calculator' },
    { path: '/compare', label: 'Compare' },
    { path: '/tests', label: 'Test Cases' },
    { path: '/about', label: 'About' }
  ];

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Functions className="h-6 w-6 text-primary" />
            <Link to="/" className="font-bold text-lg hover:text-primary transition-colors">
              Numerical Methods Explorer
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-6">
              {navItems.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={cn(
                      "text-sm transition-colors hover:text-primary",
                      location.pathname === path && "text-primary font-medium"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}