import { useContext, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { Navigate } from "react-router-dom";
import { modalIcons } from "../assets/icons";

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
        <li className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center ${isRegister ? "bg-primary" : "bg-black-50"}`} onClick={() => setIsRegister(true)}>
          登入帳號
        </li>
        <li
          className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center ${!isRegister ? "bg-primary" : "bg-black-50"}`}
          onClick={() => setIsRegister(false)}
        >
          註冊帳號
        </li>
      </ul>

      {isRegister ? (
        <div className="flex flex-col">
          <label htmlFor="email" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            帳號
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="請輸入帳號或 Email"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4 dark:bg-black-100 placeholder-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            密碼
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="請輸入密碼"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4 dark:bg-black-100 placeholder-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full rounded-lg bg-primary font-bold text-base leading-6 py-2 hover:bg-primary-dark" onClick={handleLogin}>
            登入帳號
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <label htmlFor="email" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="請輸入 Email"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4 dark:bg-black-100 placeholder-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative group flex items-center mb-2">
            <label htmlFor="account" className="font-bold text-base leading-6 text-black dark:text-black-0">
              帳號
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block" />
            <span className="absolute -bottom-1 left-[72px] transform -translate-x-0 w-max p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              帳號必須是英文及數字，且不可用符號
            </span>
          </div>
          <input
            type="text"
            name="account"
            id="account"
            placeholder="請輸入帳號"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4 dark:bg-black-100 placeholder-black"
          />
          <div className="relative group flex items-center mb-2">
            <label htmlFor="password" className="font-bold text-base leading-6 text-black dark:text-black-0">
              密碼
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block" />
            <span className="absolute -bottom-1 left-[72px] transform -translate-x-0 w-max p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              密碼可以是英文、數字或符號的組合
            </span>
          </div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="請輸入密碼"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4 dark:bg-black-100 placeholder-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="checkPassword" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            確認密碼
          </label>
          <input
            type="checkPassword"
            name="checkPassword"
            id="checkPassword"
            placeholder="請再次輸入密碼"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-4 dark:bg-black-100 placeholder-black"
          />
          <div className="relative group flex items-center mb-2">
            <label htmlFor="name" className="font-bold text-base leading-6 text-black dark:text-black-0">
              會員名稱
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block" />
            <span className="absolute -bottom-1 left-[104px] transform -translate-x-0 w-max p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              會員名稱可以是中文、英文、數字或符號，但不得超過九個字
            </span>
          </div>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="請輸入會員名稱"
            className="py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 mb-8 dark:bg-black-100 placeholder-black"
          />
          <button className="w-full rounded-lg bg-primary font-bold text-base leading-6 py-2 hover:bg-primary-dark" onClick={handleRegister}>
            註冊帳號
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
