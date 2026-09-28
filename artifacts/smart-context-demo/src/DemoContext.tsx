import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface DemoState {
  quantityCorrected: boolean;
  setQuantityCorrected: (v: boolean) => void;
  extractionConfirmed: boolean;
  setExtractionConfirmed: (v: boolean) => void;
  sapCreated: boolean;
  setSapCreated: (v: boolean) => void;
  rfqsGenerated: boolean;
  setRfqsGenerated: (v: boolean) => void;
  supplierSelected: boolean;
  setSupplierSelected: (v: boolean) => void;
  decisionSent: boolean;
  setDecisionSent: (v: boolean) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [quantityCorrected, setQuantityCorrected] = useState(false);
  const [extractionConfirmed, setExtractionConfirmed] = useState(false);
  const [sapCreated, setSapCreated] = useState(false);
  const [rfqsGenerated, setRfqsGenerated] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState(false);
  const [decisionSent, setDecisionSent] = useState(false);
  const resetDemo = useCallback(() => {
    setQuantityCorrected(false);
    setExtractionConfirmed(false);
    setSapCreated(false);
    setRfqsGenerated(false);
    setSupplierSelected(false);
    setDecisionSent(false);
  }, []);

  return (
    <DemoContext.Provider value={{
      quantityCorrected, setQuantityCorrected,
      extractionConfirmed, setExtractionConfirmed,
      sapCreated, setSapCreated,
      rfqsGenerated, setRfqsGenerated,
      supplierSelected, setSupplierSelected,
      decisionSent, setDecisionSent,
      resetDemo,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
};

export const useDemoReset = () => useContext(DemoContext)?.resetDemo ?? (() => undefined);
