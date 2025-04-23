import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function AboutPage() {
  const faqItems = [
    {
      question: "What are numerical methods?",
      answer: "Numerical methods are techniques for solving mathematical problems that cannot be solved analytically. They provide approximate solutions with controlled error and are widely used in science, engineering, and computing."
    },
    {
      question: "Why compare different numerical methods?",
      answer: "Different numerical methods have varying convergence rates, stability properties, and computational requirements. Comparing them helps in selecting the most appropriate method for a specific problem, balancing accuracy, efficiency, and reliability."
    },
    {
      question: "How does the Newton-Raphson method work?",
      answer: "The Newton-Raphson method uses the function and its derivative to find roots. Starting with an initial guess, it approximates the function with its tangent line and finds where this line crosses the x-axis, using the formula: x₁ = x₀ - f(x₀)/f'(x₀). This process repeats until convergence."
    },
    {
      question: "How does the Secant method work?",
      answer: "The Secant method approximates the derivative using two previous points instead of calculating it directly. It uses the formula: x₂ = x₁ - f(x₁)(x₁ - x₀)/(f(x₁) - f(x₀)). This makes it useful when derivatives are difficult to compute."
    },
    {
      question: "What is convergence rate?",
      answer: "Convergence rate measures how quickly a method approaches the solution. Newton-Raphson has quadratic convergence (errors approximately square with each iteration), while Secant has superlinear convergence (around 1.618 order)."
    },
    {
      question: "When might these methods fail?",
      answer: "These methods can fail when: the derivative is zero or undefined at certain points, the function has multiple closely spaced roots, the initial guess is too far from the actual root, or the function behavior is highly irregular near the root."
    }
  ];

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-4">About Numerical Methods Explorer</h1>
        <p className="text-lg text-muted-foreground">
          This application demonstrates and compares different numerical methods for finding roots of equations.
          It provides interactive visualizations and performance metrics to help understand the behavior and
          effectiveness of each method.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Numerical Methods Comparison</h2>
        <Card>
          <CardHeader>
            <CardTitle>Method Characteristics</CardTitle>
            <CardDescription>
              Key properties and performance characteristics of implemented numerical methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Convergence Rate</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Advantages</TableHead>
                  <TableHead>Limitations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Newton-Raphson</TableCell>
                  <TableCell>Quadratic (2)</TableCell>
                  <TableCell>Function + derivative</TableCell>
                  <TableCell>Fastest convergence</TableCell>
                  <TableCell>Needs derivative, sensitive to initial guess</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Secant</TableCell>
                  <TableCell>Superlinear (~1.6)</TableCell>
                  <TableCell>Only function values</TableCell>
                  <TableCell>No derivative needed</TableCell>
                  <TableCell>Slower than Newton, two initial guesses</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

export default AboutPage;