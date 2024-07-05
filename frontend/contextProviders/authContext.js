import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  reauthenticateWithCredential,
  deleteUser,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  console.log("AuthProvider: Loading", loading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Logout function
  const logout = () => {
    return signOut(auth); // Use signOut from Firebase auth
  };

  // Reset password function
  const resetPassword = () => {
    return sendPasswordResetEmail(auth, currentUser.email);
  };

  // Delete account function
  const deleteAccount = (password) => {
    setLoading(true);
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
        .then(() => {
          // User deleted from Firebase, now delete from backend
          const userId = user.uid; // Assuming you use Firebase UID as the user identifier in your backend
          return fetch(`http://localhost:3000/user/${userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.EXPO_PUBLIC_DELETE_API_KEY,
            },
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete user from backend");
          }
          console.log(
            "User successfully deleted from both Firebase and backend"
          );
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
    <AuthContext.Provider
      value={{ currentUser, loading, setLoading, logout, deleteAccount, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook to use auth in components
export const useAuth = () => useContext(AuthContext);
