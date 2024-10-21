import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { postIcons } from "../../assets/icons";

const CustomSelect = ({ options, onChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(".custom-select") === null) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select relative inline-block">
      <postIcons.TbDots
        className={`h-6 w-6 text-black ${theme === "dark" ? "dark:text-black-0" : ""} cursor-pointer hover:text-alert`}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <ul className="absolute -right-4 z-10 mt-1 w-fit overflow-hidden text-nowrap rounded-2xl border border-black-500 bg-white text-center shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className="cursor-pointer px-4 py-2 hover:bg-primary-light"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};

export default CustomSelect;
