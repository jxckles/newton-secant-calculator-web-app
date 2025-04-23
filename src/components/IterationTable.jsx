import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table.jsx';

const IterationTable = ({ iterations, method, decimalPlaces = 6 }) => {
  // Format number to specified decimal places
  const format = (num) => {
    if (num === undefined || num === null || isNaN(num)) return 'N/A';
    return num.toFixed(decimalPlaces);
  };

  // Calculate error for each iteration
  const calculateError = (iterations) => {
    if (!iterations || iterations.length === 0) return [];
    
    const finalX = iterations[iterations.length - 1].x;
    return iterations.map(iter => Number((Math.abs(iter.x - finalX)).toFixed(decimalPlaces)));
  };

  const errors = calculateError(iterations);

  return (
    <Table>
      <TableCaption>Iterations for {method === 'newton' ? 'Newton-Raphson' : 'Secant'} Method</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Iteration</TableHead>
          <TableHead>x</TableHead>
          <TableHead>f(x)</TableHead>
          {method === 'newton' && <TableHead>f'(x)</TableHead>}
          <TableHead>Error</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {iterations.map((iter, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{format(iter.x)}</TableCell>
            <TableCell>{format(iter.fx)}</TableCell>
            {method === 'newton' && <TableCell>{format(iter.dfx)}</TableCell>}
            <TableCell>{format(errors[index])}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IterationTable;