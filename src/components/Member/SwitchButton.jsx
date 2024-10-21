import PropTypes from "prop-types";

const SwitchButton = ({ isOn, handleToggle }) => {
  return (
    <div
      className={`relative inline-block h-6 w-12 rounded-full transition duration-200 ease-linear ${isOn ? "bg-primary" : "bg-black-300"}`}
      onClick={handleToggle}
    >
      <label
        htmlFor="toggle"
        className={`absolute left-0 inline-block h-6 w-6 transform cursor-pointer rounded-full bg-white transition duration-100 ease-linear ${isOn ? "translate-x-full" : "translate-x-0"}`}
      />
    </div>
  );
};

export default SwitchButton;

SwitchButton.propTypes = {
  isOn: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};
