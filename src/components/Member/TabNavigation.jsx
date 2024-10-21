import PropTypes from "prop-types";

const TabNavigation = ({ isActiveTab, setIsActiveTab }) => (
  <ul className="grid w-full grid-cols-2">
    <li
      className={`cursor-pointer rounded-s-full border border-black-500 py-1 text-center text-sm font-normal leading-5 ${isActiveTab === "member" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("member")}
    >
      會員管理
    </li>
    <li
      className={`cursor-pointer rounded-e-full border-y border-e border-black-500 py-1 text-center text-sm font-normal leading-5 ${isActiveTab === "history" ? "bg-primary" : "bg-black-50"}`}
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
