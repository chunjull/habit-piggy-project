import PropTypes from "prop-types";

const TabNavigation = ({ isActiveTab, setIsActiveTab }) => (
  <ul className="grid grid-cols-2 w-full">
    <li
      className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "member" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("member")}
    >
      會員管理
    </li>
    <li
      className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "history" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("history")}
    >
      歷史習慣
    </li>
  </ul>
);

export default TabNavigation;

TabNavigation.propTypes = {
  isActiveTab: PropTypes.string.isRequired,
  setIsActiveTab: PropTypes.func.isRequired,
};
