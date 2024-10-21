import PropTypes from "prop-types";

const TabNavigation = ({ isLogin, setIsLogin }) => (
  <ul className="grid w-full grid-cols-2">
    <li
      className={`cursor-pointer rounded-s-full border border-black-500 py-1 text-center text-sm font-normal leading-5 ${isLogin ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsLogin(true)}
    >
      登入帳號
    </li>
    <li
      className={`cursor-pointer rounded-e-full border-y border-e border-black-500 py-1 text-center text-sm font-normal leading-5 ${!isLogin ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsLogin(false)}
    >
      註冊帳號
    </li>
  </ul>
);

export default TabNavigation;

TabNavigation.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  setIsLogin: PropTypes.func.isRequired,
};
