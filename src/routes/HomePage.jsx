import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, GitCompare, ChevronRight, BookOpen } from 'lucide-react';

function HomePage() {
  const methods = [
    {
      id: 'newton-raphson',
      title: 'Newton-Raphson Method',
      description: 'A powerful iterative method for finding roots that requires the derivative of the function.',
      icon: <Calculator className="h-8 w-8 mb-2 text-primary" />,
      features: [
        'Quadratic convergence rate',
        'Requires function derivative',
        'Fastest convergence when close to root',
        'Sensitive to initial guess',
      ],
      path: '/newton-raphson',
    },
    {
      id: 'secant-method',
      title: 'Secant Method',
      description: 'An efficient root-finding algorithm that doesn\'t require derivatives.',
      icon: <Calculator className="h-8 w-8 mb-2 text-primary" />,
      features: [
        'Superlinear convergence (~1.6)',
        'No derivative needed',
        'Requires two initial points',
        'More stable than Newton in some cases',
      ],
      path: '/secant-method',
    },
    {
      id: 'comparison',
      title: 'Method Comparison',
      description: 'Compare the performance and convergence properties of different numerical methods.',
      icon: <GitCompare className="h-8 w-8 mb-2 text-primary" />,
      features: [
        'Side-by-side visualization',
        'Performance metrics',
        'Convergence rate analysis',
        'Test on different function types',
      ],
      path: '/comparison',
    },
  ];

  return (
    <div className="space-y-12">
      <section className="py-12 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Numerical Methods Explorer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          An interactive application for exploring and comparing numerical root-finding methods
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button asChild size="lg">
            <Link to="/comparison">
              Compare Methods
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/about">
              <BookOpen className="mr-2 h-4 w-4" />
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Available Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map((method) => (
            <Card key={method.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-center">{method.icon}</div>
                <CardTitle>{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {method.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={method.path}>Explore Method</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;