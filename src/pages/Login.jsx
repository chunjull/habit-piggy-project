import { addUser } from "../services/api";

function Login() {
  const handleAddUser = async () => {
    await addUser();
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="text" name="" id="" placeholder="email" className="border p-3" />
      <input type="password" name="" id="" placeholder="password" className="border p-3" />
      <button className="border p-3" onClick={handleAddUser}>
        Login
      </button>
    </div>
  );
}
export default Login;
