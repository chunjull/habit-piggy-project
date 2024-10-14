import { useContext, useReducer } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser, getEmailByAccount } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { initialState, reducer, actionTypes } from "../utils/AuthReducer";
import { Navigate } from "react-router-dom";
import TabNavigation from "../components/Login/TabNavigation";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Login/RegisterForm";
import LoadingScreen from "../components/Login/LoadingScreen";

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
        <div className="p-4 md:py-10 space-y-4">
          <TabNavigation isLogin={state.isLogin} setIsLogin={(value) => dispatch({ type: actionTypes.SET_IS_LOGIN, payload: value })} />
          {state.isLogin ? <LoginForm handleLogin={handleLogin} loginError={state.loginError} /> : <RegisterForm handleRegister={handleRegister} />}
        </div>
      )}
    </>
  );
}

export default Login;
