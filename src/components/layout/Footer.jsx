import { Calculator, Github } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span className="font-semibold">NumMethods</span>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NumMethods | Numerical Methods Comparison Project
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;