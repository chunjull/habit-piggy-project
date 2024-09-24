import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MonthCalendar from "./MonthCalendar";
import CategorySelect from "./CategorySelect";

const EditModal = ({
  habitData,
  handleHabitChange,
  handleUpdateHabit,
  handleDeleteHabit,
  handleFocus,
  showMonthCalendar,
  calendarTarget,
  calendarRef,
  handleEditModal,
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
    setHabitData((prevData) => {
      const newFrequency = { ...prevData.frequency, days: newSelectedDays };
      const newStatus = generateStatusArray(prevData.startDate, prevData.endDate, newFrequency);
      return {
        ...prevData,
        frequency: newFrequency,
        status: newStatus,
      };
    });
  };

  const generateStatusArray = (startDate, endDate, frequency) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const statusArray = [];

    if (frequency.type === "daily") {
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    } else if (frequency.type === "weekly") {
      for (let d = start; d <= end; d.setDate(d.getDate() + 7)) {
        statusArray.push({ date: new Date(d).toDateString(), completed: false });
      }
    } else if (frequency.type === "specificDays") {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const selectedDays = frequency.days || [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        if (selectedDays.includes(daysOfWeek[d.getDay()])) {
          statusArray.push({ date: new Date(d).toDateString(), completed: false });
        }
      }
    }

    return statusArray;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="flex gap-4 w-full">
          <CategorySelect options={habitCategories} value={habitData.category} onChange={(value) => handleHabitChange({ target: { name: "category", value } })} />
          <input type="text" name="title" placeholder="輸入習慣名稱" className="py-2 px-4 w-full" value={habitData.title} onChange={handleHabitChange} />
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
            checked={habitData.frequency.type === "daily"}
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
            checked={habitData.frequency.type === "weekly"}
            onChange={handleHabitChange}
          />
          <label htmlFor="weekly">每週</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="frequency"
            id="specificDays"
            value="specificDays"
            className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-slate-500 checked:border-transparent focus:outline-none"
            checked={habitData.frequency.type === "specificDays"}
            onChange={handleHabitChange}
          />
          <label htmlFor="specificDays">特定日期</label>
        </div>
      </div>
      {habitData.frequency.type === "specificDays" && (
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="text-center flex flex-col">
              {day}
              <button className={`border ${selectedDays.includes(day) ? "bg-yellow-400 text-white" : ""}`} onClick={() => handleDayButtonClick(day)}>
                DO
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between gap-4">
        <label htmlFor="amount">習慣罰款</label>
        <div className="flex gap-2">
          <p>NT$</p>
          <input type="number" name="amount" id="amount" className="px-4 text-end" value={habitData.amount} onChange={handleHabitChange} />
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
      <button className="w-full border" onClick={handleUpdateHabit}>
        更新習慣
      </button>
      <button className="w-full border bg-red-500 text-white" onClick={handleDeleteHabit}>
        刪除習慣
      </button>
    </div>
  );
};

EditModal.propTypes = {
  habitData: PropTypes.object.isRequired,
  handleHabitChange: PropTypes.func.isRequired,
  handleUpdateHabit: PropTypes.func.isRequired,
  handleDeleteHabit: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  showMonthCalendar: PropTypes.bool.isRequired,
  calendarTarget: PropTypes.string.isRequired,
  selectedDate: PropTypes.object.isRequired,
  handleSelectDate: PropTypes.func.isRequired,
  calendarRef: PropTypes.object.isRequired,
  handleEditModal: PropTypes.func.isRequired,
  habitCategories: PropTypes.array.isRequired,
  setHabitData: PropTypes.func.isRequired,
  monthCalendarDate: PropTypes.object.isRequired,
  handleMonthCalendarSelectDate: PropTypes.func.isRequired,
};

export default EditModal;
