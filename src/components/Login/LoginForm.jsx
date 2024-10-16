import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

const LoginForm = ({ handleLogin, loginError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
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
  );
};

export default LoginForm;

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  loginError: PropTypes.string,
};
