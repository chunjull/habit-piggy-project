import { useState } from "react";
import PropTypes from "prop-types";
import { checkIcons } from "../assets/icons";

const CategorySelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {value === null ? (
          <div className="bg-slate-300 w-10 h-10 rounded-full flex justify-center items-center">
            <checkIcons.TbCheck className="w-8 h-8" />
          </div>
        ) : (
          selectedOption && (
            <div className="bg-yellow-400 w-10 h-10 rounded-full flex justify-center items-center">
              <selectedOption.icon className="w-8 h-8" />
            </div>
          )
        )}
      </div>
      {isOpen && (
        <ul className="absolute top-12 z-10 bg-white border p-2 grid grid-cols-4 min-w-max gap-y-2 gap-x-4">
          {options.map((option) => (
            <li key={option.id} className="w-16 h-fit cursor-pointer flex flex-col items-center gap-1 text-nowrap" onClick={() => handleSelect(option.id)}>
              <div className="bg-slate-300 w-10 h-10 rounded-full flex justify-center items-center hover:bg-yellow-400">
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

CategorySelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

CategorySelect.defaultProps = {
  value: null,
};

export default CategorySelect;
