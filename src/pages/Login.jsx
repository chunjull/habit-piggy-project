import { addUser } from "../services/api";

function Login() {
  const handleAddUser = async () => {
    await addUser();
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" placeholder="email" className="border p-3" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" placeholder="password" className="border p-3" />
      <button className="border p-3 mt-4" onClick={handleAddUser}>
        Login
      </button>
    </div>
  );
}
export default Login;
