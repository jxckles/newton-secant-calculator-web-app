"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function IterationTable({ iterations }) {
  return (
    <div className="max-h-[400px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Iter.</TableHead>
            <TableHead>x</TableHead>
            <TableHead>f(x)</TableHead>
            <TableHead>Error</TableHead>
            {iterations[0]?.derivative !== undefined && (
              <TableHead>f'(x)</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {iterations.map((iteration, i) => (
            <TableRow key={i}>
              <TableCell>{i}</TableCell>
              <TableCell>{iteration.x.toFixed(6)}</TableCell>
              <TableCell>{iteration.fx.toExponential(4)}</TableCell>
              <TableCell>{iteration.error.toExponential(4)}</TableCell>
              {iteration.derivative !== undefined && (
                <TableCell>{iteration.derivative.toExponential(4)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}