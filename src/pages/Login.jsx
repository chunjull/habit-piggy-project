import { useContext, useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser, getEmailByAccount } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { Navigate } from "react-router-dom";
import habitPiggyLoading1 from "../assets/images/habit-piggy-loading-1.svg";
import habitPiggyLoading2 from "../assets/images/habit-piggy-loading-2.svg";
import TabNavigation from "../components/Login/TabNavigation";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Login/RegisterForm";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(habitPiggyLoading1);
  const { setUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage === habitPiggyLoading1 ? habitPiggyLoading2 : habitPiggyLoading1));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <img src={currentImage} alt="loading" className="w-40 h-40 object-cover" />
        <p className="font-normal text-base text-black dark:text-black-0">準備好培養習慣了嗎？</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:py-10 space-y-4">
      <TabNavigation isLogin={isLogin} setIsLogin={setIsLogin} />
      {isLogin ? <LoginForm handleLogin={handleLogin} loginError={loginError} /> : <RegisterForm handleRegister={handleRegister} />}
    </div>
  );
}

export default Login;
