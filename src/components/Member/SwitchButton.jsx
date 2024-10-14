import PropTypes from "prop-types";

const SwitchButton = ({ isOn, handleToggle }) => {
  return (
    <div className={`relative inline-block w-12 h-6 transition duration-200 ease-linear rounded-full ${isOn ? "bg-primary" : "bg-black-300"}`} onClick={handleToggle}>
      <label
        htmlFor="toggle"
        className={`absolute left-0 inline-block w-6 h-6 transition duration-100 ease-linear transform bg-white rounded-full cursor-pointer ${isOn ? "translate-x-full" : "translate-x-0"}`}
      />
    </div>
  );
};

export default SwitchButton;

SwitchButton.propTypes = {
  isOn: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};
