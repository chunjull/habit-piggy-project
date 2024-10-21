import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { dropdownIcon } from "../assets/icons";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

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
    <div className="custom-select relative inline-block w-full">
      <div
        className="flex cursor-pointer items-center justify-between rounded-2xl border border-black-500 bg-white px-4 py-0.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <dropdownIcon.TbChevronDown className="h-6 w-6 text-black" />
      </div>
      {isOpen && (
        <ul className="absolute right-0 z-10 mt-1 w-full min-w-fit overflow-hidden rounded-2xl border border-black-500 bg-white text-center shadow-lg">
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
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomSelect;
