import MonthCalendar from "./MonthCalendar";
import PropTypes from "prop-types";
import CategorySelect from "./CategorySelect";

const HabitModal = ({
  habitData,
  handleHabitChange,
  handleAddHabit,
  handleFocus,
  showMonthCalendar,
  calendarTarget,
  selectedDate,
  handleSelectDate,
  calendarRef,
  handleHabitModal,
  habitCategories,
}) => (
  <div className="space-y-4">
    <div className="flex justify-between gap-4">
      <div className="flex gap-4 w-full">
        <CategorySelect options={habitCategories} value={habitData.category} onChange={(value) => handleHabitChange({ target: { name: "category", value } })} />
        <input type="text" name="title" placeholder="輸入習慣名稱" className="py-2 px-4 w-full" value={habitData.title} onChange={handleHabitChange} />
      </div>
      <button onClick={handleHabitModal}>close</button>
    </div>
    <div className="flex justify-between gap-4">
      <label htmlFor="frequency">習慣頻率</label>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="frequency"
          id="daily"
          value="daily"
          className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-slate-500 checked:border-transparent focus:outline-none"
          checked={habitData.frequency === "daily"}
          onChange={handleHabitChange}
        />
        <label htmlFor="daily">每日</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="frequency"
          id="weekly"
          value="weekly"
          className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-slate-500 checked:border-transparent focus:outline-none"
          checked={habitData.frequency === "weekly"}
          onChange={handleHabitChange}
        />
        <label htmlFor="weekly">每週</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="frequency"
          id="specificDay"
          value="specificDays"
          className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-slate-500 checked:border-transparent focus:outline-none"
          checked={habitData.frequency === "specificDays"}
          onChange={handleHabitChange}
        />
        <label htmlFor="specificDay">特定日期</label>
      </div>
    </div>
    <div className="flex justify-between gap-4">
      <label htmlFor="amount">習慣罰款</label>
      <div className="flex gap-2">
        <p>NT$</p>
        <input type="number" name="amount" id="amount" className="px-4" value={habitData.amount} onChange={handleHabitChange} />
      </div>
    </div>
    <div className="flex justify-between gap-4 w-full">
      <label htmlFor="range" className="text-nowrap">
        養成期間
      </label>
      <div className="relative">
        <input
          type="text"
          name="startDate"
          id="startDate"
          className="text-center"
          placeholder="開始日期"
          value={habitData.startDate}
          onFocus={() => handleFocus("startDate")}
          onChange={handleHabitChange}
        />
        {showMonthCalendar && calendarTarget === "startDate" && (
          <div ref={calendarRef} className="absolute z-10 bg-white shadow-lg w-[300px]">
            <MonthCalendar date={selectedDate} onSelect={handleSelectDate} />
          </div>
        )}
      </div>
      <p>~</p>
      <div className="relative">
        <input type="text" name="endDate" id="endDate" className="text-center" placeholder="結束日期" value={habitData.endDate} onFocus={() => handleFocus("endDate")} onChange={handleHabitChange} />
        {showMonthCalendar && calendarTarget === "endDate" && (
          <div ref={calendarRef} className="absolute z-10 bg-white shadow-lg w-[300px]">
            <MonthCalendar date={selectedDate} onSelect={handleSelectDate} />
          </div>
        )}
      </div>
    </div>
    <button className="w-full border" onClick={handleAddHabit}>
      養成習慣
    </button>
  </div>
);

HabitModal.propTypes = {
  habitData: PropTypes.object.isRequired,
  handleHabitChange: PropTypes.func.isRequired,
  handleAddHabit: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  showMonthCalendar: PropTypes.bool.isRequired,
  calendarTarget: PropTypes.string.isRequired,
  selectedDate: PropTypes.object.isRequired,
  handleSelectDate: PropTypes.func.isRequired,
  calendarRef: PropTypes.object.isRequired,
  handleHabitModal: PropTypes.func.isRequired,
  habitCategories: PropTypes.array.isRequired,
};

export default HabitModal;
