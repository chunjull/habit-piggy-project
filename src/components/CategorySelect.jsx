import PropTypes from "prop-types";

const CategorySelect = ({ options, value, onChange }) => {
  const handleSelect = (option) => {
    onChange(option);
  };

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="w-full">
      <ul className="grid grid-cols-4 gap-2">
        {options.map((option) => (
          <li key={option.id} className="w-16 h-fit cursor-pointer flex flex-col items-center gap-1 text-nowrap font-normal text-xs leading-4" onClick={() => handleSelect(option.id)}>
            <div className={`w-10 h-10 rounded-full flex justify-center items-center ${selectedOption && selectedOption.id === option.id ? "bg-primary" : "bg-black-200 hover:bg-primary"}`}>
              <option.icon className="w-8 h-8" />
            </div>
            {option.name}
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

CategorySelect.defaultProps = {
  value: null,
};

export default CategorySelect;
