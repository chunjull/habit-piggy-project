import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsDarkMode(currentUser?.isDarkMode);
    });

    return () => unsubscribe();
  }, [auth]);

  return <AuthContext.Provider value={{ user, setUser, isDarkMode, setIsDarkMode }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

AuthProvider.propTypes = {
  children: PropTypes.node,
};
