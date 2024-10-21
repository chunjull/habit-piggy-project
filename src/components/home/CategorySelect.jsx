import PropTypes from "prop-types";

const CategorySelect = ({ options, value = null, onChange }) => {
  const handleSelect = (option) => {
    onChange(option);
  };

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="w-full">
      <ul className="grid grid-cols-4 gap-2">
        {options.map((option) => (
          <li
            key={option.id}
            className="flex h-fit w-16 cursor-pointer flex-col items-center gap-1 text-nowrap text-xs font-normal leading-4"
            onClick={() => handleSelect(option.id)}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedOption && selectedOption.id === option.id ? "bg-primary" : "bg-black-200 hover:bg-primary"}`}
            >
              <option.icon className="h-8 w-8" />
            </div>
            <p className="text-black dark:text-black-0">{option.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

CategorySelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default CategorySelect;
