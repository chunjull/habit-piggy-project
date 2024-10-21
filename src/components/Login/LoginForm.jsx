import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

const LoginForm = ({ handleLogin, loginError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      loginAccount: "example",
      loginPassword: "examplepassword",
    },
  });

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
      <label
        htmlFor="loginAccount"
        className="mb-2 text-base font-bold leading-6 text-black dark:text-black-0"
      >
        帳號
      </label>
      <input
        type="text"
        name="loginAccount"
        id="loginAccount"
        placeholder="請輸入帳號"
        className={`w-full rounded-xl border border-black-300 px-4 py-2 text-base font-normal leading-6 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100 ${
          errors.loginAccount ? "" : "mb-4"
        }`}
        {...register("loginAccount", { required: "Email 是必填項目" })}
      />
      {errors.loginAccount && (
        <p className="mb-3 mt-1 pl-4 text-alert">
          {errors.loginAccount.message}
        </p>
      )}

      <label
        htmlFor="loginPassword"
        className="mb-2 text-base font-bold leading-6 text-black dark:text-black-0"
      >
        密碼
      </label>
      <input
        type="password"
        name="loginPassword"
        id="loginPassword"
        placeholder="請輸入密碼"
        className={`w-full rounded-xl border border-black-300 px-4 py-2 text-base font-normal leading-6 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100 ${
          errors.loginPassword ? "" : "mb-8"
        }`}
        {...register("loginPassword", { required: "密碼是必填項目" })}
      />
      {errors.loginPassword && (
        <p className="mb-3 mt-1 pl-4 text-alert">
          {errors.loginPassword.message}
        </p>
      )}

      {loginError && <p className="text-alert">{loginError}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-primary py-2 text-base font-bold leading-6 hover:bg-primary-dark"
      >
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
