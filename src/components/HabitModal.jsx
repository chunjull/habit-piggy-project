import { useState, useEffect } from "react";
import MonthCalendar from "./MonthCalendar";
import PropTypes from "prop-types";
import CategorySelect from "./CategorySelect";
import { modalIcons } from "../assets/icons";
import { checkIcon } from "../assets/icons";

const HabitModal = ({
  habitData,
  handleHabitChange,
  handleAddHabit,
  handleFocus,
  showMonthCalendar,
  calendarTarget,
  calendarRef,
  handleHabitModal,
  habitCategories,
  setHabitData,
  monthCalendarDate,
  handleMonthCalendarSelectDate,
}) => {
  const [selectedDays, setSelectedDays] = useState(habitData.frequency.days || []);

  useEffect(() => {
    setSelectedDays(habitData.frequency.days || []);
  }, [habitData.frequency.days]);

  const handleDayButtonClick = (day) => {
    const newSelectedDays = selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day];
    setSelectedDays(newSelectedDays);
    setHabitData((prevData) => ({
      ...prevData,
      frequency: { ...prevData.frequency, days: newSelectedDays },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <CategorySelect options={habitCategories} value={habitData.category} onChange={(value) => handleHabitChange({ target: { name: "category", value } })} />
          <input
            type="text"
            name="title"
            placeholder="輸入習慣名稱"
            className="py-1.5 px-4 w-full rounded-2xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-sm leading-5"
            value={habitData.title}
            onChange={handleHabitChange}
          />
        </div>
        <modalIcons.TbX className="w-6 h-6 hover:text-alert cursor-pointer" onClick={handleHabitModal} />
      </div>
      <div className="flex justify-between gap-4">
        <label htmlFor="frequency" className="text-nowrap">
          習慣頻率
        </label>
        <div className="w-full grid grid-cols-3 gap-3">
          <div>
            <input type="radio" name="frequency" id="daily" value="daily" className="appearance-none hidden" checked={habitData.frequency.type === "daily"} onChange={handleHabitChange} />
            <label
              htmlFor="daily"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border ${
                habitData.frequency.type === "daily" ? "bg-primary border-primary" : "border-black-300 hover:bg-primary-light"
              }`}
            >
              每日
            </label>
          </div>
          <div>
            <input type="radio" name="frequency" id="weekly" value="weekly" className="appearance-none hidden" checked={habitData.frequency.type === "weekly"} onChange={handleHabitChange} />
            <label
              htmlFor="weekly"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border ${
                habitData.frequency.type === "weekly" ? "bg-primary border-primary" : "border-black-300 hover:bg-primary-light"
              }`}
            >
              每週
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="frequency"
              id="specificDays"
              value="specificDays"
              className="appearance-none hidden"
              checked={habitData.frequency.type === "specificDays"}
              onChange={handleHabitChange}
            />
            <label
              htmlFor="specificDays"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border ${
                habitData.frequency.type === "specificDays" ? "bg-primary border-primary" : "border-black-300 hover:bg-primary-light"
              }`}
            >
              特定日期
            </label>
          </div>
        </div>
      </div>
      {habitData.frequency.type === "specificDays" && (
        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="text-center flex flex-col justify-center items-center gap-1">
              {day}
              <checkIcon.TbCheck
                className={`w-10 h-10 rounded-full p-1 border border-black-500 ${selectedDays.includes(day) ? "bg-primary text-white border-primary" : "text-black-500 hover:bg-primary-light"}`}
                onClick={() => handleDayButtonClick(day)}
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between gap-4">
        <label htmlFor="amount" className="text-nowrap">
          習慣罰款
        </label>
        <div className="flex gap-2 w-full">
          <p>NT$</p>
          <input type="number" name="amount" id="amount" className="px-4 text-end w-full" value={habitData.amount} onChange={handleHabitChange} />
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
            className="text-center w-28"
            placeholder="開始日期"
            value={habitData.startDate}
            onFocus={() => handleFocus("startDate")}
            onChange={handleHabitChange}
          />
          {showMonthCalendar && calendarTarget === "startDate" && (
            <div ref={calendarRef} className="absolute -top-36 -left-8 z-10 bg-white shadow-lg w-[300px]">
              <MonthCalendar date={monthCalendarDate} onSelect={handleMonthCalendarSelectDate} />
            </div>
          )}
        </div>
        <p>~</p>
        <div className="relative">
          <input
            type="text"
            name="endDate"
            id="endDate"
            className="text-center w-28"
            placeholder="結束日期"
            value={habitData.endDate}
            onFocus={() => handleFocus("endDate")}
            onChange={handleHabitChange}
          />
          {showMonthCalendar && calendarTarget === "endDate" && (
            <div ref={calendarRef} className="absolute -top-36 -left-64 z-10 bg-white shadow-lg w-[300px]">
              <MonthCalendar date={monthCalendarDate} onSelect={handleMonthCalendarSelectDate} />
            </div>
          )}
        </div>
      </div>
      <button className="w-full border" onClick={handleAddHabit}>
        養成習慣
      </button>
    </div>
  );
};

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
  setHabitData: PropTypes.func.isRequired,
  monthCalendarDate: PropTypes.object.isRequired,
  handleMonthCalendarSelectDate: PropTypes.func.isRequired,
};

export default HabitModal;
