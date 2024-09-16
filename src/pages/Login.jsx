import { useState } from "react";
import { registerUser, logout } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);

  const handleRegister = async () => {
    await registerUser(email, password);
  };

  const handleLogin = async () => {
    console.log("Login with", email, password);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-4 flex flex-col">
      <div className="flex justify-between mb-4">
        <button className={`border p-3 ${isRegister ? "bg-gray-200" : ""}`} onClick={() => setIsRegister(true)}>
          Register
        </button>
        <button className={`border p-3 ${!isRegister ? "bg-gray-200" : ""}`} onClick={() => setIsRegister(false)}>
          Login
        </button>
      </div>

      {isRegister ? (
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" placeholder="email" className="border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="password" className="border p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="border p-3 mt-4" onClick={handleRegister}>
            Register
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default Login;
