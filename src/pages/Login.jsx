import { useContext, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { Navigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setUser } = useContext(AuthContext);

  const handleRegister = async () => {
    await registerUser(email, password);
    alert("Registered successfully");
    setIsRegister(true);
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setIsLoggedIn(true);
      console.log("Login with", email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error logging in: ", error.code, error.message);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="p-4 md:py-10 space-y-4">
      <ul className="grid grid-cols-2 w-full">
        <li
          className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center ${isRegister ? "bg-primary" : "bg-black-50 dark:bg-black-800"}`}
          onClick={() => setIsRegister(true)}
        >
          Login
        </li>
        <li
          className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center ${!isRegister ? "bg-primary" : "bg-black-50 dark:bg-black-800"}`}
          onClick={() => setIsRegister(false)}
        >
          Register
        </li>
      </ul>

      {isRegister ? (
        <div className="flex flex-col">
          <label htmlFor="email" className="font-bold text-base leading-6 mb-2">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="font-bold text-base leading-6 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full rounded-lg bg-primary font-bold text-base leading-6 py-2 hover:bg-primary-dark" onClick={handleLogin}>
            Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <label htmlFor="email" className="font-bold text-base leading-6 mb-2">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="font-bold text-base leading-6 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full rounded-lg bg-primary font-bold text-base leading-6 py-2 hover:bg-primary-dark" onClick={handleRegister}>
            Register
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
