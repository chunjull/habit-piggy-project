import PropTypes from "prop-types";

const Statistics = ({ completed, savings, total }) => (
  <div className="flex justify-between items-center">
    <div>
      <div className="flex justify-end items-center gap-1">
        <p className="font-bold text-base leading-6 text-black dark:text-black-0">{completed}</p>
        <p className="font-normal text-sm leading-5 text-black dark:text-black-0">次</p>
      </div>
      <p className="font-normal text-xs leading-4 md:text-sm md:leading-5 text-black dark:text-black-0">完成習慣次數</p>
    </div>
    <div>
      <div className="flex justify-end items-center gap-1">
        <p className="font-bold text-base leading-6 text-black dark:text-black-0">{savings}</p>
        <p className="font-normal text-sm leading-5 text-black dark:text-black-0">次</p>
      </div>
      <p className="font-normal text-xs leading-4 md:text-sm md:leading-5 text-black dark:text-black-0">存款次數</p>
    </div>
    <div>
      <div className="flex justify-end items-center gap-1">
        <p className="font-normal text-sm leading-5 text-black dark:text-black-0">NT$</p>
        <p className="font-bold text-base leading-6 text-black dark:text-black-0">{total}</p>
      </div>
      <p className="font-normal text-xs leading-4 md:text-sm md:leading-5 text-black dark:text-black-0">存款金額</p>
    </div>
  </div>
);

export default Statistics;

Statistics.propTypes = {
  completed: PropTypes.number.isRequired,
  savings: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};
