import { useContext } from "react";
import { NumericalMethodsContext } from "@/context/NumericalMethodsContext";

export function useNumericalMethodsContext() {
  const context = useContext(NumericalMethodsContext);
  if (!context) {
    throw new Error("useNumericalMethodsContext must be used within a NumericalMethodsProvider");
  }
  return context;
}