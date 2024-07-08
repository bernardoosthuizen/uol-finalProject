import { createContext, useContext } from "react";

// Create context
export const ConnectivityContext = createContext();

// Custom hook to use the context
export const useConnectivity = () => useContext(ConnectivityContext);
