import { createContext, useContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

// Create context
export const ConnectivityContext = createContext();

// Custom hook to use the context
export const useConnectivity = () => useContext(ConnectivityContext);

// Provider component
export const ConnectivityProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isConnected }}>
      {children}
    </ConnectivityContext.Provider>
  );
};
