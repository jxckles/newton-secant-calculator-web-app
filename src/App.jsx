import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/layout/AppLayout";
import NumericalMethodsApp from "@/components/numerical/NumericalMethodsApp";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AppLayout>
        <NumericalMethodsApp />
      </AppLayout>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;