import { useContext, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser, logoutUser } from "../services/api";
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

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out successfully");
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="p-4 space-y-4">
      <ul className="grid grid-cols-2 w-full">
        <li className={`border p-2 text-center ${isRegister ? "bg-gray-200" : ""}`} onClick={() => setIsRegister(true)}>
          Login
        </li>
        <li className={`border p-2 text-center ${!isRegister ? "bg-gray-200" : ""}`} onClick={() => setIsRegister(false)}>
          Register
        </li>
      </ul>

      {isRegister ? (
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" placeholder="email" className="border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="password" className="border p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="border p-3 mt-4" onClick={handleLogin}>
            Login
          </button>
          <button className="border bg-slate-300 p-3 mt-4" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" placeholder="email" className="border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="password" className="border p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="border p-3 mt-4" onClick={handleRegister}>
            Register
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
