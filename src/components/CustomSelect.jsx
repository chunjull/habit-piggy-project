import { useState } from "react";
import { dropdownIcon } from "../assets/icons";
import PropTypes from "prop-types";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value) || options[0];

  return (
    <div className="relative inline-block w-full">
      <div className="border border-black-500 rounded-2xl px-4 py-0.5 bg-white cursor-pointer flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption.label}</span>
        <dropdownIcon.TbChevronDown className="w-6 h-6 text-black" />
      </div>
      {isOpen && (
        <ul className="absolute right-0 z-10 mt-1 min-w-fit w-full bg-white border border-black-500 rounded-2xl shadow-lg text-center overflow-hidden">
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
