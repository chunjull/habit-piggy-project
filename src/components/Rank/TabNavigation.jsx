import PropTypes from "prop-types";

const TabNavigation = ({ isActiveTab, setIsActiveTab }) => (
  <ul className="grid grid-cols-2 w-full pb-3">
    <li
      className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "habit" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("habit")}
    >
      習慣排行
    </li>
    <li
      className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "savings" ? "bg-primary" : "bg-black-50"}`}
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
