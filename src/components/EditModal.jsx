import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MonthCalendar from "./MonthCalendar";
import CategorySelect from "./CategorySelect";
import { modalIcons } from "../assets/icons";
import { checkIcon } from "../assets/icons";

const EditModal = ({
  habitData,
  handleHabitChange,
  handleUpdateHabit,
  handleDeleteHabit,
  handleFocus,
  showMonthCalendar,
  calendarRef,
  handleEditModal,
  habitCategories,
  setHabitData,
  monthCalendarDate,
  handleMonthCalendarSelectDate,
  setCalendarTarget,
  setShowMonthCalendar,
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

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const handleStartDateClick = () => {
    setCalendarTarget("startDate");
    setShowMonthCalendar(true);
  };

  const handleEndDateClick = () => {
    setCalendarTarget("endDate");
    setShowMonthCalendar(true);
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
            className="py-1.5 px-4 w-full rounded-xl border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-sm leading-5"
            value={habitData.title}
            onChange={handleHabitChange}
          />
        </div>
        <modalIcons.TbX className="w-6 h-6 hover:text-alert cursor-pointer" onClick={handleEditModal} />
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
                habitData.frequency.type === "daily" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light"
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
                habitData.frequency.type === "weekly" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light"
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
                habitData.frequency.type === "specificDays" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light"
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
          <p className="font-normal text-base leading-6">NT$</p>
          <input
            type="number"
            name="amount"
            id="amount"
            className="px-4 text-end w-full rounded border border-black-300 caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-sm leading-5 no-spinner"
            placeholder="請輸入未完成習慣的罰款金額"
            value={habitData.amount}
            onChange={handleHabitChange}
            min={0}
            onKeyDown={(e) => e.key === "-" && e.preventDefault()}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 w-full">
        <p className="text-nowrap">養成期間</p>
        <div className="border border-black-300 w-full rounded py-0.5 px-4 flex justify-between items-center bg-black-0 relative">
          <button className={`text-center w-1/2 font-normal text-sm leading-5 ${habitData.startDate ? "text-black" : "text-black-300"}`} onClick={handleStartDateClick}>
            {habitData.startDate || "開始日期"}
          </button>
          <p className="px-2 text-black-300 font-normal text-sm leading-5">-</p>
          <button className={`text-center w-1/2 font-normal text-sm leading-5 ${habitData.startDate ? "text-black" : "text-black-300"}`} onClick={handleEndDateClick}>
            {habitData.endDate || "結束日期"}
          </button>
        </div>
        <input
          type="text"
          name="startDate"
          id="startDate"
          className="hidden"
          ref={startDateRef}
          placeholder="開始日期"
          value={habitData.startDate}
          onFocus={() => handleFocus("startDate")}
          onChange={handleHabitChange}
        />
        <input
          type="text"
          name="endDate"
          id="endDate"
          className="hidden"
          ref={endDateRef}
          placeholder="結束日期"
          value={habitData.endDate}
          onFocus={() => handleFocus("endDate")}
          onChange={handleHabitChange}
        />
        {showMonthCalendar && (
          <div ref={calendarRef} className="absolute bottom-10 md:-bottom-24 2xl:bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <MonthCalendar date={monthCalendarDate} onSelect={handleMonthCalendarSelectDate} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="w-full py-1 font-normal text-sm leading-5 bg-alert text-white rounded-lg" onClick={handleDeleteHabit}>
          刪除習慣
        </button>
        <button className="w-full py-1 font-normal text-sm leading-5 bg-primary rounded-lg hover:bg-primary-dark" onClick={handleUpdateHabit}>
          更新習慣
        </button>
      </div>
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
  setCalendarTarget: PropTypes.func.isRequired,
  setShowMonthCalendar: PropTypes.func.isRequired,
};

export default EditModal;
