import PropTypes from "prop-types";

const TabNavigation = ({ tabs, isActiveTab, setIsActiveTab }) => (
  <ul className="grid w-full grid-cols-2">
    {tabs.map((tab, index) => (
      <li
        key={tab.key}
        className={`cursor-pointer ${index === 0 ? "rounded-s-full" : "rounded-e-full"} ${index === 0 ? "border border-black-500" : "border-y border-e border-black-500"} py-1 text-center text-sm font-normal leading-5 ${isActiveTab === tab.key ? "bg-primary" : "bg-black-50"}`}
        onClick={() => setIsActiveTab(tab.key)}
      >
        {tab.label}
      </li>
    ))}
  </ul>
);

TabNavigation.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isActiveTab: PropTypes.string.isRequired,
  setIsActiveTab: PropTypes.func.isRequired,
};

export default TabNavigation;
