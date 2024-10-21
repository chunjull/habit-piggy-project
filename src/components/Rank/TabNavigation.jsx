import PropTypes from "prop-types";

const TabNavigation = ({ isActiveTab, setIsActiveTab }) => (
  <ul className="grid w-full grid-cols-2 pb-3">
    <li
      className={`cursor-pointer rounded-s-full border border-black-500 py-1 text-center text-sm font-normal leading-5 ${isActiveTab === "habit" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("habit")}
    >
      習慣排行
    </li>
    <li
      className={`cursor-pointer rounded-e-full border-y border-e border-black-500 py-1 text-center text-sm font-normal leading-5 ${isActiveTab === "savings" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("savings")}
    >
      存款排行
    </li>
  </ul>
);

export default TabNavigation;

TabNavigation.propTypes = {
  isActiveTab: PropTypes.string.isRequired,
  setIsActiveTab: PropTypes.func.isRequired,
};
