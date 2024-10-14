import CustomSelect from "../CustomSelect";
import SavingsChart from "./SavingsChart";
import Statistics from "./Statistics";
import UncompletedHabitsList from "./UncompletedHabitsList";
import { modalIcons } from "../../assets/icons";
import PropTypes from "prop-types";

const OverviewSection = ({ filter, setFilter, options, completedCount, savingsCount, totalSavings, chartData, habits, getStartAndEndOfPeriod, customSelectRef }) => {
  return (
    <div>
      <div className="p-4 bg-black-50 dark:bg-black-800 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative group flex items-center flex-grow">
            <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">存款總覽</h2>
            <modalIcons.TbInfoCircle className="w-6 h-6 text-black-500 dark:text-black-200 ml-2 inline-block cursor-help" />
            <span className="absolute top-0 left-32 transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:top-7 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
              結算時間為每日 23:59:59，存款金額為當日未完成的習慣存款金額總和
            </span>
          </div>
          <div className="relative" ref={customSelectRef}>
            <CustomSelect options={options} value={filter} onChange={setFilter} />
          </div>
        </div>
        <Statistics completed={completedCount} savings={savingsCount} total={totalSavings} />
        <div className="w-full h-52">
          <SavingsChart data={chartData} />
        </div>
      </div>
      <UncompletedHabitsList habits={habits} getStartAndEndOfPeriod={getStartAndEndOfPeriod} filter={filter} />
      {savingsCount === 0 && (
        <>
          <p className="text-center mt-2 font-normal text-xs leading-4 md:text-base md:leading-6 text-black dark:text-black-0">找不到相關的存款資料</p>
          <p className="text-center mt-2 font-normal text-xs leading-4 md:text-base md:leading-6 text-black dark:text-black-0">要不要試著培養一些習慣呢？</p>
        </>
      )}
      {savingsCount >= 50 && <p className="text-center mt-2 font-normal text-xs leading-4 md:text-base md:leading-6 text-black dark:text-black-0">僅顯示最新的 50 筆存款記錄</p>}
    </div>
  );
};

export default OverviewSection;

OverviewSection.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  completedCount: PropTypes.number.isRequired,
  savingsCount: PropTypes.number.isRequired,
  totalSavings: PropTypes.number.isRequired,
  chartData: PropTypes.array.isRequired,
  habits: PropTypes.array.isRequired,
  getStartAndEndOfPeriod: PropTypes.func.isRequired,
  customSelectRef: PropTypes.object.isRequired,
};
