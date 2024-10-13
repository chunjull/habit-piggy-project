import { useContext, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser, getEmailByAccount } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { Navigate } from "react-router-dom";
import TabNavigation from "../components/Login/TabNavigation";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Login/RegisterForm";
import LoadingScreen from "../components/Login/LoadingScreen";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  const handleRegister = async (data) => {
    const { email, registerPassword, account, name } = data;
    try {
      await registerUser(email, registerPassword, account, name);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, registerPassword);
      setUser(userCredential.user);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 2000);
    } catch (error) {
      console.error("Error registering user: ", error.code, error.message);
    }
  };

  const handleLogin = async (data) => {
    const { loginAccount, loginPassword } = data;
    const auth = getAuth();
    try {
      const email = await getEmailByAccount(loginAccount);
      if (!email) {
        setLoginError("帳號或密碼錯誤");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, loginPassword);
      setUser(userCredential.user);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 2000);
    } catch (error) {
      setLoginError("帳號或密碼錯誤");
      console.error("Error logging in: ", error.code, error.message);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <>
      {isLoading ? (
        <LoadingScreen isLoading={isLoading} />
      ) : (
        <div className="p-4 md:py-10 space-y-4">
          <TabNavigation isLogin={isLogin} setIsLogin={setIsLogin} />
          {isLogin ? <LoginForm handleLogin={handleLogin} loginError={loginError} /> : <RegisterForm handleRegister={handleRegister} />}
        </div>
      )}
    </>
  );
}

export default Login;
