import PropTypes from "prop-types";
import { modalIcons } from "../../assets/icons";
import CustomSelect from "../CustomSelect";
import SavingsChart from "./SavingsChart";
import Statistics from "./Statistics";
import UncompletedHabitsList from "./UncompletedHabitsList";

const OverviewSection = ({
  filter,
  setFilter,
  options,
  completedCount,
  savingsCount,
  totalSavings,
  chartData,
  habits,
  getStartAndEndOfPeriod,
  customSelectRef,
}) => {
  return (
    <div>
      <div className="space-y-4 rounded-xl bg-black-50 p-4 dark:bg-black-800">
        <div className="flex items-center justify-between">
          <div className="group relative flex flex-grow items-center">
            <h2 className="text-xl font-bold leading-7 text-black dark:text-black-0">
              存款總覽
            </h2>
            <modalIcons.TbInfoCircle className="ml-2 inline-block h-6 w-6 cursor-help text-black-500 dark:text-black-200" />
            <span className="pointer-events-none absolute left-32 top-0 z-50 w-fit -translate-x-0 transform whitespace-normal break-words rounded bg-primary-dark p-2 text-sm text-white opacity-0 transition-opacity before:absolute before:-left-4 before:top-7 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
              結算時間為每日 23:59:59，存款金額為當日未完成的習慣存款金額總和
            </span>
          </div>
          <div className="relative" ref={customSelectRef}>
            <CustomSelect
              options={options}
              value={filter}
              onChange={setFilter}
            />
          </div>
        </div>
        <Statistics
          completed={completedCount}
          savings={savingsCount}
          total={totalSavings}
        />
        <div className="h-52 w-full">
          <SavingsChart data={chartData} />
        </div>
      </div>
      <UncompletedHabitsList
        habits={habits}
        getStartAndEndOfPeriod={getStartAndEndOfPeriod}
        filter={filter}
      />
      {savingsCount === 0 && (
        <>
          <p className="mt-2 text-center text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
            找不到相關的存款資料
          </p>
          <p className="mt-2 text-center text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
            要不要試著培養一些習慣呢？
          </p>
        </>
      )}
      {savingsCount >= 50 && (
        <p className="mt-2 text-center text-xs font-normal leading-4 text-black dark:text-black-0 md:text-base md:leading-6">
          僅顯示最新的 50 筆存款記錄
        </p>
      )}
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
