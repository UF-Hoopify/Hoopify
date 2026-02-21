import React, { createContext, ReactNode, useContext, useState } from "react";
import { CourtDocument } from "../types/CourtServerTypes";

interface CourtContextType {
  activeCourt: CourtDocument | null;
  setActiveCourt: (court: CourtDocument | null) => void;
}

const CourtContext = createContext<CourtContextType | undefined>(undefined);
export const CourtProvider = ({ children }: { children: ReactNode }) => {
  const [activeCourt, setActiveCourt] = useState<CourtDocument | null>(null);

  return (
    <CourtContext.Provider value={{ activeCourt, setActiveCourt }}>
      {children}
    </CourtContext.Provider>
  );
};

export const useCourtContext = () => {
  const context = useContext(CourtContext);
  if (!context) {
    throw new Error("useCourtContext must be used within a CourtProvider");
  }
  return context;
};
