import { useState } from "react";
import { postIcons } from "../assets/icons";
import PropTypes from "prop-types";

const CustomSelect = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <postIcons.TbDots className="w-6 h-6 text-black dark:text-black-0 cursor-pointer hover:text-alert" onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-fit -right-4 bg-white border border-black-500 rounded-2xl shadow-lg text-center text-nowrap overflow-hidden">
          {options.map((option) => (
            <li key={option.value} className="px-4 py-2 hover:bg-primary-light cursor-pointer" onClick={() => handleSelect(option.value)}>
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
};

export default CustomSelect;
