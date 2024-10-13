import PropTypes from "prop-types";

const TabNavigation = ({ isActiveTab, setIsActiveTab }) => (
  <ul className="grid grid-cols-2 w-full">
    <li
      className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "overview" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("overview")}
    >
      存款總覽
    </li>
    <li
      className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "category" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("category")}
    >
      習慣養成總覽
    </li>
  </ul>
);

export default TabNavigation;

TabNavigation.propTypes = {
  isActiveTab: PropTypes.string.isRequired,
  setIsActiveTab: PropTypes.func.isRequired,
};
