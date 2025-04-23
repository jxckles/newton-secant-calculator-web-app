import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IterationTable({ iterations, method }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Iteration</TableHead>
            {method === "newton-raphson" ? (
              <>
                <TableHead>x_n</TableHead>
                <TableHead>f(x_n)</TableHead>
                <TableHead>f'(x_n)</TableHead>
              </>
            ) : (
              <>
                <TableHead>x_n-1</TableHead>
                <TableHead>x_n</TableHead>
                <TableHead>f(x_n-1)</TableHead>
                <TableHead>f(x_n)</TableHead>
              </>
            )}
            <TableHead>x_n+1</TableHead>
            <TableHead>Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {iterations.map((iteration, index) => (
            <TableRow key={index}>
              <TableCell>{iteration.iteration}</TableCell>
              {method === "newton-raphson" ? (
                <>
                  <TableCell>{iteration.x.toFixed(6)}</TableCell>
                  <TableCell>{iteration.fx.toFixed(6)}</TableCell>
                  <TableCell>{iteration.dfx?.toFixed(6) || "N/A"}</TableCell>
                </>
              ) : (
                <>
                  <TableCell>{iteration.x0?.toFixed(6) || "N/A"}</TableCell>
                  <TableCell>{iteration.x1?.toFixed(6) || "N/A"}</TableCell>
                  <TableCell>{iteration.fx0?.toFixed(6) || "N/A"}</TableCell>
                  <TableCell>{iteration.fx1?.toFixed(6) || "N/A"}</TableCell>
                </>
              )}
              <TableCell>{iteration.nextX?.toFixed(6) || "N/A"}</TableCell>
              <TableCell>{iteration.error?.toExponential(4) || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}