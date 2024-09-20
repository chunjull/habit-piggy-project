import PropTypes from "prop-types";
import MonthCalendar from "./MonthCalendar";

const EditModal = ({
  habitData,
  handleChange,
  handleUpdateHabit,
  handleDeleteHabit,
  handleFocus,
  showMonthCalendar,
  calendarTarget,
  selectedDate,
  handleSelectDate,
  calendarRef,
  handleEditModal,
  habitCategories,
}) => (
  <div className="space-y-4">
    <div className="flex justify-between gap-4">
      <div className="flex gap-4 w-full">
        <select name="category" value={habitData.category} onChange={handleChange} className="border py-2 px-4">
          {Object.entries(habitCategories).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <input type="text" name="title" placeholder="輸入習慣名稱" className="py-2 px-4 w-full" value={habitData.title} onChange={handleChange} />
      </div>
      <button onClick={handleEditModal}>close</button>
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
        />
        <label htmlFor="specificDay">特定日期</label>
      </div>
    </div>
    <div className="flex justify-between gap-4">
      <label htmlFor="amount">習慣罰款</label>
      <div className="flex gap-2">
        <p>NT$</p>
        <input type="number" name="amount" id="amount" className="px-4" value={habitData.amount} onChange={handleChange} />
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
          onChange={handleChange}
        />
        {showMonthCalendar && calendarTarget === "startDate" && (
          <div ref={calendarRef} className="absolute z-10 bg-white shadow-lg w-[300px]">
            <MonthCalendar date={selectedDate} onSelect={handleSelectDate} />
          </div>
        )}
      </div>
      <p>~</p>
      <div className="relative">
        <input type="text" name="endDate" id="endDate" className="text-center" placeholder="結束日期" value={habitData.endDate} onFocus={() => handleFocus("endDate")} onChange={handleChange} />
        {showMonthCalendar && calendarTarget === "endDate" && (
          <div ref={calendarRef} className="absolute z-10 bg-white shadow-lg w-[300px]">
            <MonthCalendar date={selectedDate} onSelect={handleSelectDate} />
          </div>
        )}
      </div>
    </div>
    <button className="w-full border" onClick={handleUpdateHabit}>
      更新習慣
    </button>
    <button className="w-full border bg-red-500 text-white" onClick={handleDeleteHabit}>
      刪除習慣
    </button>
  </div>
);

EditModal.propTypes = {
  habitData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleUpdateHabit: PropTypes.func.isRequired,
  handleDeleteHabit: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  showMonthCalendar: PropTypes.bool.isRequired,
  calendarTarget: PropTypes.string.isRequired,
  selectedDate: PropTypes.object.isRequired,
  handleSelectDate: PropTypes.func.isRequired,
  calendarRef: PropTypes.object.isRequired,
  handleEditModal: PropTypes.func.isRequired,
  habitCategories: PropTypes.object.isRequired,
};

export default EditModal;