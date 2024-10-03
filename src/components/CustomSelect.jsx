import { useState } from "react";
import { dropdownIcon } from "../assets/icons";
import PropTypes from "prop-types";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <div className="border border-black-500 rounded-2xl px-4 py-0.5 bg-white cursor-pointer flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
        <span>{options.find((option) => option.value === value).label}</span>
        <dropdownIcon.TbChevronDown className="w-6 h-6 text-black dark:text-black-0" />
      </div>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-black-500 rounded-2xl shadow-lg text-center overflow-hidden">
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
