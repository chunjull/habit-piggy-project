import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser, getEmailByAccount } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { Navigate } from "react-router-dom";
import { modalIcons } from "../assets/icons";
import habitPiggyLoading1 from "../assets/images/habit-piggy-loading-1.svg";
import habitPiggyLoading2 from "../assets/images/habit-piggy-loading-2.svg";
import TabNavigation from "../components/Login/TabNavigation";

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(habitPiggyLoading1);
  const { setUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage === habitPiggyLoading1 ? habitPiggyLoading2 : habitPiggyLoading1));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleRegister = async (data) => {
    const { email, registerPassword, account, name } = data;
    try {
      await registerUser(email, registerPassword, account, name);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, registerPassword);
      setUser(userCredential.user);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
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
        setLoginError("帳號或密碼錯誤");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, loginPassword);
      setUser(userCredential.user);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 2000);
    } catch (error) {
      setLoginError("帳號或密碼錯誤");
      console.error("Error logging in: ", error.code, error.message);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <img src={currentImage} alt="loading" className="w-40 h-40 object-cover" />
        <p className="font-normal text-base text-black dark:text-black-0">準備好培養習慣了嗎？</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:py-10 space-y-4">
      <TabNavigation isLogin={isLogin} setIsLogin={setIsLogin} />

      {isLogin ? (
        <div className="relative min-h-screen">
          <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
            <label htmlFor="loginAccount" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
              帳號
            </label>
            <input
              type="text"
              name="loginAccount"
              id="loginAccount"
              placeholder="請輸入帳號"
              className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
                errors.loginAccount ? "" : "mb-4"
              }`}
              {...register("loginAccount", { required: "Email 是必填項目" })}
            />
            {errors.loginAccount && <p className="text-alert pl-4 mt-1 mb-3">{errors.loginAccount.message}</p>}

            <label htmlFor="loginPassword" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
              密碼
            </label>
            <input
              type="password"
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
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col">
          <label htmlFor="email" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            Email
          </label>
          <input
            type="email"
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
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block cursor-help" />
            <span className="absolute -bottom-1 left-[72px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
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
            <label htmlFor="registerPassword" className="font-bold text-base leading-6 text-black dark:text-black-0">
              密碼
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block cursor-help" />
            <span className="absolute -bottom-1 left-[72px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
              密碼可以是英文、數字或符號的組合，至少需要 6 個字符
            </span>
          </div>
          <input
            type="password"
            name="registerPassword"
            id="registerPassword"
            placeholder="請輸入密碼"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.registerPassword ? "" : "mb-4"
            }`}
            {...register("registerPassword", {
              required: "密碼是必填項目",
              minLength: {
                value: 6,
                message: "密碼至少需要 6 個字符",
              },
            })}
          />
          {errors.registerPassword && <p className="text-alert pl-4 mt-1 mb-3">{errors.registerPassword.message}</p>}

          <label htmlFor="registerCheckPassword" className="font-bold text-base leading-6 mb-2 text-black dark:text-black-0">
            確認密碼
          </label>
          <input
            type="password"
            name="registerCheckPassword"
            id="registerCheckPassword"
            placeholder="請再次輸入密碼"
            className={`py-2 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-base leading-6 dark:bg-black-100 placeholder-black ${
              errors.registerCheckPassword ? "" : "mb-4"
            }`}
            {...register("registerCheckPassword", {
              required: "確認密碼是必填項目",
              validate: (value) => value === watch("registerPassword") || "密碼不一致",
              minLength: {
                value: 6,
                message: "密碼至少需要 6 個字符",
              },
            })}
          />
          {errors.registerCheckPassword && <p className="text-alert pl-4 mt-1 mb-3">{errors.registerCheckPassword.message}</p>}

          <div className="relative group flex items-center mb-2">
            <label htmlFor="name" className="font-bold text-base leading-6 text-black dark:text-black-0">
              會員名稱
            </label>
            <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200 ml-2 inline-block cursor-help" />
            <span className="absolute -bottom-1 left-[104px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
              會員名稱可以是中文、英文、數字或符號，但不得超過 9 個字符
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
