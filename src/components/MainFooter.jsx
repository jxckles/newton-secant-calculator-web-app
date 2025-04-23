import React from 'react';
import { Heart, Github } from 'lucide-react';

export function MainFooter() {
  return (
    <footer className="border-t py-6 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Numerical Methods Explorer
          </p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span className="text-sm text-muted-foreground flex items-center">
              Developer's Github ➡️
            </span>
            <a
              href="https://github.com/jxckles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}