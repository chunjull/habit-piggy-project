import PropTypes from "prop-types";

const Statistics = ({ completed, savings, total }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="flex items-center justify-end gap-1">
        <p className="text-base font-bold leading-6 text-black dark:text-black-0">
          {completed}
        </p>
        <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
          次
        </p>
      </div>
      <p className="text-xs font-normal leading-4 text-black dark:text-black-0 md:text-sm md:leading-5">
        完成習慣次數
      </p>
    </div>
    <div>
      <div className="flex items-center justify-end gap-1">
        <p className="text-base font-bold leading-6 text-black dark:text-black-0">
          {savings}
        </p>
        <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
          次
        </p>
      </div>
      <p className="text-xs font-normal leading-4 text-black dark:text-black-0 md:text-sm md:leading-5">
        存款次數
      </p>
    </div>
    <div>
      <div className="flex items-center justify-end gap-1">
        <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
          NT$
        </p>
        <p className="text-base font-bold leading-6 text-black dark:text-black-0">
          {total}
        </p>
      </div>
      <p className="text-xs font-normal leading-4 text-black dark:text-black-0 md:text-sm md:leading-5">
        存款金額
      </p>
    </div>
  </div>
);

export default Statistics;

Statistics.propTypes = {
  completed: PropTypes.number.isRequired,
  savings: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};
