import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useReducer } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/Login/LoadingScreen";
import LoginBanner from "../components/Login/LoginBanner";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Login/RegisterForm";
import TabNavigation from "../components/Login/TabNavigation";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { getEmailByAccount, registerUser } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { actionTypes, initialState, reducer } from "../utils/AuthReducer";

function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setUser } = useContext(AuthContext);

  const handleRegister = async (data) => {
    const { email, registerPassword, account, name } = data;
    try {
      await registerUser(email, registerPassword, account, name);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, registerPassword);
      setUser(userCredential.user);
      dispatch({ type: actionTypes.SET_IS_LOADING, payload: true });
      setTimeout(() => {
        dispatch({ type: actionTypes.SET_IS_LOGGED_IN, payload: true });
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
        dispatch({ type: actionTypes.SET_LOGIN_ERROR, payload: "帳號或密碼錯誤" });
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, loginPassword);
      setUser(userCredential.user);
      dispatch({ type: actionTypes.SET_IS_LOADING, payload: true });
      setTimeout(() => {
        dispatch({ type: actionTypes.SET_IS_LOGGED_IN, payload: true });
      }, 2000);
    } catch (error) {
      dispatch({ type: actionTypes.SET_LOGIN_ERROR, payload: "帳號或密碼錯誤" });
      console.error("Error logging in: ", error.code, error.message);
    }
  };

  if (state.isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <>
      {state.isLoading ? (
        <LoadingScreen isLoading={state.isLoading} />
      ) : (
        <div className="flex flex-col justify-between h-full">
          <Header />
          <div className="p-4 md:py-8 space-y-4 w-full md:w-1/2 h-fit md:bg-black-50 md:mx-auto rounded-2xl">
            <TabNavigation isLogin={state.isLogin} setIsLogin={(value) => dispatch({ type: actionTypes.SET_IS_LOGIN, payload: value })} />
            {state.isLogin ? <LoginForm handleLogin={handleLogin} loginError={state.loginError} /> : <RegisterForm handleRegister={handleRegister} />}
          </div>
          {state.isLogin && <LoginBanner />}
          <Footer />
        </div>
      )}
    </>
  );
}

export default Login;
