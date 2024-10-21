import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { modalIcons } from "../../assets/icons";

const RegisterForm = ({ handleRegister }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col">
      <label
        htmlFor="email"
        className="mb-2 text-base font-bold leading-6 text-black dark:text-black-0"
      >
        Email
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="請輸入 Email"
        className={`w-full rounded-xl border border-black-300 px-4 py-2 text-base font-normal leading-6 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100 ${
          errors.email ? "" : "mb-4"
        }`}
        {...register("email", { required: "Email 是必填項目" })}
      />
      {errors.email && (
        <p className="mb-3 mt-1 pl-4 text-alert">{errors.email.message}</p>
      )}

      <div className="group relative mb-2 flex items-center">
        <label
          htmlFor="account"
          className="text-base font-bold leading-6 text-black dark:text-black-0"
        >
          帳號
        </label>
        <modalIcons.TbInfoCircle className="ml-2 inline-block h-4 w-4 cursor-help text-black-500 dark:text-black-200" />
        <span className="pointer-events-none absolute -bottom-1 left-[72px] z-50 w-fit -translate-x-0 transform whitespace-normal break-words rounded bg-primary-dark p-2 text-sm text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
          帳號可以是英文、數字或符號的組合
        </span>
      </div>
      <input
        type="text"
        name="account"
        id="account"
        placeholder="請輸入帳號"
        className={`w-full rounded-xl border border-black-300 px-4 py-2 text-base font-normal leading-6 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100 ${
          errors.account ? "" : "mb-4"
        }`}
        {...register("account", { required: "帳號是必填項目" })}
      />
      {errors.account && (
        <p className="mb-3 mt-1 pl-4 text-alert">{errors.account.message}</p>
      )}

      <div className="group relative mb-2 flex items-center">
        <label
          htmlFor="registerPassword"
          className="text-base font-bold leading-6 text-black dark:text-black-0"
        >
          密碼
        </label>
        <modalIcons.TbInfoCircle className="ml-2 inline-block h-4 w-4 cursor-help text-black-500 dark:text-black-200" />
        <span className="pointer-events-none absolute -bottom-1 left-[72px] z-50 w-fit -translate-x-0 transform whitespace-normal break-words rounded bg-primary-dark p-2 text-sm text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
          密碼可以是英文、數字或符號的組合，至少需要 6 個字符
        </span>
      </div>
      <input
        type="password"
        name="registerPassword"
        id="registerPassword"
        placeholder="請輸入密碼"
        className={`w-full rounded-xl border border-black-300 px-4 py-2 text-base font-normal leading-6 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100 ${
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
      {errors.registerPassword && (
        <p className="mb-3 mt-1 pl-4 text-alert">
          {errors.registerPassword.message}
        </p>
      )}

      <label
        htmlFor="registerCheckPassword"
        className="mb-2 text-base font-bold leading-6 text-black dark:text-black-0"
      >
        確認密碼
      </label>
      <input
        type="password"
        name="registerCheckPassword"
        id="registerCheckPassword"
        placeholder="請再次輸入密碼"
        className={`w-full rounded-xl border border-black-300 px-4 py-2 text-base font-normal leading-6 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100 ${
          errors.registerCheckPassword ? "" : "mb-4"
        }`}
        {...register("registerCheckPassword", {
          required: "確認密碼是必填項目",
          validate: (value) =>
            value === watch("registerPassword") || "密碼不一致",
          minLength: {
            value: 6,
            message: "密碼至少需要 6 個字符",
          },
        })}
      />
      {errors.registerCheckPassword && (
        <p className="mb-3 mt-1 pl-4 text-alert">
          {errors.registerCheckPassword.message}
        </p>
      )}

      <div className="group relative mb-2 flex items-center">
        <label
          htmlFor="name"
          className="text-base font-bold leading-6 text-black dark:text-black-0"
        >
          會員名稱
        </label>
        <modalIcons.TbInfoCircle className="ml-2 inline-block h-4 w-4 cursor-help text-black-500 dark:text-black-200" />
        <span className="pointer-events-none absolute -bottom-1 left-[104px] z-50 w-fit -translate-x-0 transform whitespace-normal break-words rounded bg-primary-dark p-2 text-sm text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
          會員名稱可以是中文、英文、數字或符號，但不得超過 9 個字符
        </span>
      </div>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="請輸入會員名稱"
        className={`w-full rounded-xl border border-black-300 px-4 py-2 text-base font-normal leading-6 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100 ${
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
      {errors.name && (
        <p className="mb-3 mt-1 pl-4 text-alert">{errors.name.message}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-primary py-2 text-base font-bold leading-6 hover:bg-primary-dark"
      >
        註冊帳號
      </button>
    </form>
  );
};

export default RegisterForm;

RegisterForm.propTypes = {
  handleRegister: PropTypes.func.isRequired,
};
