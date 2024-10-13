import { useForm } from "react-hook-form";
import { modalIcons } from "../../assets/icons";
import PropTypes from "prop-types";

const RegisterForm = ({ handleRegister }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
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
  );
};

export default RegisterForm;

RegisterForm.propTypes = {
  handleRegister: PropTypes.func.isRequired,
};
