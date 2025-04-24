// src/store/useCalculationStore.js
import { create } from 'zustand';
import { auth } from '../config/firebase-config';
import { saveCalculation, listenToCalculations } from '../lib/firebaseCalculations';

const useCalculationStore = create((set, get) => ({
  // Current calculation state
  currentCalculation: null,
  
  // History of calculations
  calculationHistory: [],
  
  // Set current calculation
  setCurrentCalculation: (data) => set({ currentCalculation: data }),
  
  // Save to Firebase
  saveCalculation: async (calculationId) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const { currentCalculation } = get();
    if (!currentCalculation) return;
    
    await saveCalculation(user.uid, calculationId || Date.now().toString(), currentCalculation);
  },
  
  // Load from Firebase
  loadCalculations: () => {
    const user = auth.currentUser;
    if (!user) return;
    
    return listenToCalculations(user.uid, (data) => {
      const history = Object.entries(data).map(([id, calculation]) => ({
        id,
        ...calculation
      }));
      set({ calculationHistory: history });
    });
  },
  
  // Clear current calculation
  clearCurrentCalculation: () => set({ currentCalculation: null }),
}));

export default useCalculationStore;