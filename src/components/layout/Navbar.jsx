import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, MoonStar, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../context/ThemeProvider.jsx';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/newton-raphson', label: 'Newton-Raphson' },
    { to: '/secant-method', label: 'Secant Method' },
    { to: '/comparison', label: 'Comparison' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Calculator className="h-6 w-6" />
            <span className="font-bold text-xl">NumMethods</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-4">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link 
                  to={to} 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                    isActive(to) 
                      ? 'text-primary bg-muted' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <MoonStar className="h-5 w-5" />
            )}
          </Button>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(to) 
                    ? 'text-primary bg-muted' 
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;