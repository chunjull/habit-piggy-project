import PropTypes from "prop-types";

const TabNavigation = ({ isLogin, setIsLogin }) => (
  <ul className="grid grid-cols-2 w-full">
    <li className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isLogin ? "bg-primary" : "bg-black-50"}`} onClick={() => setIsLogin(true)}>
      登入帳號
    </li>
    <li
      className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${!isLogin ? "bg-primary" : "bg-black-50"}`}
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
