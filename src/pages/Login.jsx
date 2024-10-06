import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser, getEmailByAccount } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { Navigate } from "react-router-dom";
import { modalIcons } from "../assets/icons";

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  const handleRegister = async (data) => {
    const { email, password, account, name } = data;
    try {
      await registerUser(email, password, account, name);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error registering user: ", error.code, error.message);
    }
  };

  const handleLogin = async (data) => {
    const { emailOrAccount, password } = data;
    const auth = getAuth();
    try {
      let email = emailOrAccount;
      if (!emailOrAccount.includes("@")) {
        email = await getEmailByAccount(emailOrAccount);
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setIsLoggedIn(true);
    } catch (error) {
      setLoginError("帳號或密碼錯誤");
      console.error("Error logging in: ", error.code, error.message);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="p-4 md:py-10 space-y-4">
      <ul className="grid grid-cols-2 w-full">
        <li className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center ${isLogin ? "bg-primary" : "bg-black-50"}`} onClick={() => setIsLogin(true)}>
          登入帳號
        </li>
        <li className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center ${!isLogin ? "bg-primary" : "bg-black-50"}`} onClick={() => setIsLogin(false)}>
          註冊帳號
        </li>
      </ul>

      {isLogin ? (
        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
          <label htmlFor="emailOrAccount" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            帳號
          </label>
          <input
            type="text"
            name="emailOrAccount"
            id="emailOrAccount"
            placeholder="請輸入帳號或 Email"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.emailOrAccount ? "" : "mb-4"
            }`}
            {...register("emailOrAccount", { required: "帳號是必填項目" })}
          />
          {errors.emailOrAccount && <p className="text-alert pl-4 mt-1 mb-3">{errors.emailOrAccount.message}</p>}

          <label htmlFor="loginPassword" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            密碼
          </label>
          <input
            type="loginPassword"
            name="loginPassword"
            id="loginPassword"
            placeholder="請輸入密碼"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.loginPassword ? "" : "mb-8"
            }`}
            {...register("loginPassword", { required: "密碼是必填項目" })}
          />
          {errors.loginPassword && <p className="text-alert pl-4 mt-1 mb-3">{errors.loginPassword.message}</p>}

          {loginError && <p className="text-alert">{loginError}</p>}

          <button type="submit" className="w-full rounded-lg bg-primary font-bold text-base leading-6 py-2 hover:bg-primary-dark">
            登入帳號
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col">
          <label htmlFor="email" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="請輸入 Email"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.email ? "" : "mb-4"
            }`}
            {...register("email", { required: "Email 是必填項目" })}
          />
          {errors.email && <p className="text-alert pl-4 mt-1 mb-3">{errors.email.message}</p>}

          <div className="relative group flex items-center mb-2">
            <label htmlFor="account" className="font-bold text-base leading-6 text-black dark:text-black-0">
              帳號
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block" />
            <span className="absolute -bottom-1 left-[72px] transform -translate-x-0 w-max p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              帳號可以是英文、數字或符號的組合
            </span>
          </div>
          <input
            type="text"
            name="account"
            id="account"
            placeholder="請輸入帳號"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.account ? "" : "mb-4"
            }`}
            {...register("account", { required: "帳號是必填項目" })}
          />
          {errors.account && <p className="text-alert pl-4 mt-1 mb-3">{errors.account.message}</p>}

          <div className="relative group flex items-center mb-2">
            <label htmlFor="password" className="font-bold text-base leading-6 text-black dark:text-black-0">
              密碼
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block" />
            <span className="absolute -bottom-1 left-[72px] transform -translate-x-0 w-max p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              密碼可以是英文、數字或符號的組合，至少需要 6 個字符
            </span>
          </div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="請輸入密碼"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.password ? "" : "mb-4"
            }`}
            {...register("password", {
              required: "密碼是必填項目",
              minLength: {
                value: 6,
                message: "密碼至少需要 6 個字符",
              },
            })}
          />
          {errors.password && <p className="text-alert pl-4 mt-1 mb-3">{errors.password.message}</p>}

          <label htmlFor="checkPassword" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            確認密碼
          </label>
          <input
            type="password"
            name="checkPassword"
            id="checkPassword"
            placeholder="請再次輸入密碼"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.checkPassword ? "" : "mb-4"
            }`}
            {...register("checkPassword", {
              required: "確認密碼是必填項目",
              validate: (value) => value === watch("password") || "密碼不一致",
              minLength: {
                value: 6,
                message: "密碼至少需要 6 個字符",
              },
            })}
          />
          {errors.checkPassword && <p className="text-alert pl-4 mt-1 mb-3">{errors.checkPassword.message}</p>}

          <div className="relative group flex items-center mb-2">
            <label htmlFor="name" className="font-bold text-base leading-6 text-black dark:text-black-0">
              會員名稱
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block" />
            <span className="absolute -bottom-1 left-[104px] transform -translate-x-0 w-max p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              會員名稱可以是中文、英文、數字或符號，但不得超過 9 個字
            </span>
          </div>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="請輸入會員名稱"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.name ? "" : "mb-8"
            }`}
            {...register("name", {
              required: "會員名稱是必填項目",
              maxLength: {
                value: 9,
                message: "會員名稱不得超過 9 個字符",
              },
            })}
          />
          {errors.name && <p className="text-alert pl-4 mt-1 mb-3">{errors.name.message}</p>}

          <button type="submit" className="w-full rounded-lg bg-primary font-bold text-base leading-6 py-2 hover:bg-primary-dark">
            註冊帳號
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
