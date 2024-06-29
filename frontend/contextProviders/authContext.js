import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  reauthenticateWithCredential,
  deleteUser,
  EmailAuthProvider,
} from "firebase/auth";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Logout function
  const logout = () => {
    return signOut(auth); // Use signOut from Firebase auth
  };

  // Delete account function
  const deleteAccount = (password) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(user.email, password); // Create credential with email and password

      // Re-authenticate user
      return reauthenticateWithCredential(user, credential)
        .then(() => {
          // User re-authenticated, proceed to delete account
          return deleteUser(user);
        })
        .catch((error) => {
          console.error(
            "Error during re-authentication or account deletion:",
            error
          );
          return Promise.reject(error); // Propagate error
        });
    } else {
      console.log("No user is currently signed in.");
      return Promise.reject("No user is currently signed in.");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout, deleteAccount }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook to use auth in components
export const useAuth = () => useContext(AuthContext);
