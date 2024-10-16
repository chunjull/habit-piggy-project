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
    <div className="flex items-center w-full border border-black-300 rounded overflow-hidden">
      <button type="button" className="py-1 px-4 bg-black-200 hover:bg-primary cursor-pointer" onClick={handleDecrement} disabled={amount <= min}>
        <habitAddIcon.TbMinus className="w-4 h-4" />
      </button>
      <input
        type="number"
        name="amount"
        id="amount"
        className="px-4 text-center w-full h-6 font-normal text-sm leading-5 no-spinner dark:bg-black-100 dark:placeholder-black-400 focus:outline-none focus:border-none"
        value={amount}
        readOnly
      />
      <button type="button" className="py-1 px-4 bg-black-200 hover:bg-primary cursor-pointer" onClick={handleIncrement} disabled={amount >= max}>
        <habitAddIcon.TbPlus className="w-4 h-4" />
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
