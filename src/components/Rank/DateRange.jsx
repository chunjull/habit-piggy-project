import PropTypes from "prop-types";

const DateRange = ({ getStartAndEndOfWeek }) => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
  return (
    <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">
      在 {startOfWeek.toLocaleDateString()}～{endOfWeek.toLocaleDateString()} 期間
    </p>
  );
};

export default DateRange;

DateRange.propTypes = {
  getStartAndEndOfWeek: PropTypes.func.isRequired,
};
