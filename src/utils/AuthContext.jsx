import { getAuth, onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUser({ ...currentUser, ...profile });
        setIsDarkMode(profile.isDarkMode || false);
      } else {
        setUser(null);
        setIsDarkMode(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isDarkMode, setIsDarkMode, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

AuthProvider.propTypes = {
  children: PropTypes.node,
};
