import { useState } from "react";
import PropTypes from "prop-types";
import { checkIcon } from "../assets/icons";

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
          <div className="bg-black-200 dark:bg-black-400 border border-black-300 w-10 h-10 rounded-full flex justify-center items-center">
            <checkIcon.TbCheck className="w-8 h-8 text-black-700 dark:text-black-0" />
          </div>
        ) : (
          selectedOption && (
            <div className="bg-primary w-10 h-10 rounded-full flex justify-center items-center">
              <selectedOption.icon className="w-8 h-8" />
            </div>
          )
        )}
      </div>
      {isOpen && (
        <div className="absolute top-12 z-10 drop-shadow">
          <ul className="relative before:content-[''] before:absolute before:top-[-4px] before:left-4 before:w-4 before:h-4 before:bg-black-0 before:rotate-45 before:z-20 bg-black-0 p-4 grid grid-cols-4 min-w-max gap-3 rounded-xl">
            {options.map((option) => (
              <li key={option.id} className="w-16 h-fit cursor-pointer flex flex-col items-center gap-1 text-nowrap font-normal text-xs leading-4" onClick={() => handleSelect(option.id)}>
                <div className="bg-black-200 w-10 h-10 rounded-full flex justify-center items-center hover:bg-primary">
                  <option.icon className="w-8 h-8" />
                </div>
                {option.name}
              </li>
            ))}
          </ul>
        </div>
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
