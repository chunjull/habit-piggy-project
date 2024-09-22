import { useState } from "react";
import PropTypes from "prop-types";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="w-10 h-10 border cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {options.find((option) => option.id === value)?.name || "Select..."}
      </div>
      {isOpen && (
        <ul className="absolute top-14 z-10 bg-white border p-4 grid grid-cols-4 min-w-max gap-6">
          {options.map((option) => (
            <li key={option.id} className="w-16 h-fit cursor-pointer flex flex-col items-center gap-1 hover:bg-gray-200 text-nowrap" onClick={() => handleSelect(option.id)}>
              <div className="bg-slate-300 w-10 h-10 rounded-full flex justify-center items-center">
                <option.icon className="w-8 h-8" />
              </div>
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomSelect;
