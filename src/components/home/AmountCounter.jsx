import PropTypes from "prop-types";
import { useState } from "react";
import { habitAddIcon } from "../../assets/icons";

const AmountCounter = ({ value, onChange, min = 10, max = 100, step = 10 }) => {
  const [amount, setAmount] = useState(value || 0);

  const handleIncrement = () => {
    if (amount + step <= max) {
      const newAmount = amount + step;
      setAmount(newAmount);
      onChange({ target: { name: "amount", value: newAmount } });
    }
  };

  const handleDecrement = () => {
    if (amount - step >= min) {
      const newAmount = amount - step;
      setAmount(newAmount);
      onChange({ target: { name: "amount", value: newAmount } });
    }
  };

  return (
    <div className="flex w-full items-center overflow-hidden rounded border border-black-300">
      <button
        type="button"
        className="cursor-pointer bg-black-200 px-4 py-1 hover:bg-primary"
        onClick={handleDecrement}
        disabled={amount <= min}
      >
        <habitAddIcon.TbMinus className="h-4 w-4" />
      </button>
      <input
        type="number"
        name="amount"
        id="amount"
        className="no-spinner h-6 w-full px-4 text-center text-sm font-normal leading-5 focus:border-none focus:outline-none dark:bg-black-100 dark:placeholder-black-400"
        value={amount}
        readOnly
      />
      <button
        type="button"
        className="cursor-pointer bg-black-200 px-4 py-1 hover:bg-primary"
        onClick={handleIncrement}
        disabled={amount >= max}
      >
        <habitAddIcon.TbPlus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AmountCounter;

AmountCounter.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};
