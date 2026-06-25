/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);