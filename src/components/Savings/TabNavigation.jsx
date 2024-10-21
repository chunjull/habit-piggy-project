import PropTypes from "prop-types";

const TabNavigation = ({ isActiveTab, setIsActiveTab }) => (
  <ul className="grid w-full grid-cols-2">
    <li
      className={`cursor-pointer rounded-s-full border border-black-500 py-1 text-center text-sm font-normal leading-5 ${isActiveTab === "overview" ? "bg-primary" : "bg-black-50"}`}
      onClick={() => setIsActiveTab("overview")}
    >
      存款總覽
    </li>
    <li
      className={`cursor-pointer rounded-e-full border-y border-e border-black-500 py-1 text-center text-sm font-normal leading-5 ${isActiveTab === "category" ? "bg-primary" : "bg-black-50"}`}
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
