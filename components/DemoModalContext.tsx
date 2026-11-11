'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoModal } from './DemoModal';

interface DemoModalContextType {
  openDemoModal: () => void;
  closeDemoModal: () => void;
  isOpen: boolean;
}

const DemoModalContext = createContext<DemoModalContextType>({
  openDemoModal: () => {},
  closeDemoModal: () => {},
  isOpen: false,
});

export function DemoModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Allow triggering via window custom event if needed
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('todedev:open-demo-modal', handleOpen);
    return () => window.removeEventListener('todedev:open-demo-modal', handleOpen);
  }, []);

  return (
    <DemoModalContext.Provider
      value={{
        openDemoModal: () => setIsOpen(true),
        closeDemoModal: () => setIsOpen(false),
        isOpen,
      }}
    >
      {children}
      <DemoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  return useContext(DemoModalContext);
}

