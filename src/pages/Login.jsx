import { useState } from "react";
import { registerUser } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await registerUser(email, password);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" placeholder="email" className="border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" placeholder="password" className="border p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="border p-3 mt-4" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}
export default Login;
