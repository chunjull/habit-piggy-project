import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "../services/api";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  return <AuthContext.Provider value={{ user, setUser, isDarkMode, setIsDarkMode }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

AuthProvider.propTypes = {
  children: PropTypes.node,
};
