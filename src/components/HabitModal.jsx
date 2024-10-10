import { useState, useEffect } from "react";
import MonthCalendar from "./MonthCalendar";
import PropTypes from "prop-types";
import CategorySelect from "./CategorySelect";
import { modalIcons, checkIcon } from "../assets/icons";
import { toast } from "react-hot-toast";
import AmountCounter from "./AmountCounter";

const HabitModal = ({
  habitData,
  handleHabitChange,
  handleAddHabit,
  showMonthCalendar,
  calendarRef,
  handleHabitModal,
  habitCategories,
  setHabitData,
  monthCalendarDate,
  handleMonthCalendarSelectDate,
  setShowMonthCalendar,
}) => {
  const [selectedDays, setSelectedDays] = useState(habitData.frequency.days || []);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSelectedDays(habitData.frequency.days || []);
  }, [habitData.frequency.days]);

  const handleDayButtonClick = (day) => {
    const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
    const newSelectedDays = selectedDays.includes(dayIndex) ? selectedDays.filter((d) => d !== dayIndex) : [...selectedDays, dayIndex];
    setSelectedDays(newSelectedDays);
    setHabitData((prevData) => ({
      ...prevData,
      frequency: { ...prevData.frequency, days: newSelectedDays },
    }));
  };

  const handleWeeklyDayButtonClick = (day) => {
    const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
    setSelectedDays([dayIndex]);
    setHabitData((prevData) => ({
      ...prevData,
      frequency: { ...prevData.frequency, day: dayIndex },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!habitData.title) newErrors.title = "請輸入習慣名稱";
    if (!habitData.category && habitData.category !== 0) newErrors.category = "請選擇習慣類別";
    if (!habitData.frequency.type) newErrors.frequency = "請選擇習慣頻率";
    if (habitData.frequency.type === "specificDays" && selectedDays.length === 0) newErrors.days = "請選擇至少一天";
    if (!habitData.type) newErrors.type = "請選擇習慣類型";
    if (!habitData.amount) newErrors.amount = "請輸入罰款金額";
    if (!habitData.startDate) newErrors.startDate = "請選擇開始日期";
    if (!habitData.endDate) newErrors.endDate = "請選擇結束日期";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      addHabitErrorNotify();
      return;
    }
    handleAddHabit();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleHabitChange(e);

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value) {
        delete newErrors[name];
      }
      return newErrors;
    });

    if (name === "frequency") {
      if (value === "weekly") {
        setSelectedDays([]);
        setHabitData((prevData) => ({
          ...prevData,
          frequency: { type: value, day: null },
        }));
      } else if (value === "specificDays") {
        setSelectedDays([]);
        setHabitData((prevData) => ({
          ...prevData,
          frequency: { type: value, days: [] },
        }));
      } else {
        setHabitData((prevData) => ({
          ...prevData,
          frequency: { type: value },
        }));
      }
    }
  };

  const addHabitErrorNotify = () => {
    toast.error("沒有完整填寫資料的話，沒辦法送出喔！", {
      style: {
        borderRadius: "16px",
        background: "#212121",
        color: "#fff",
      },
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <input
            type="text"
            name="title"
            placeholder="輸入習慣名稱"
            className="py-1.5 px-4 w-full rounded-xl border caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark font-normal text-sm leading-5 dark:bg-black-100 placeholder-black"
            value={habitData.title}
            onChange={handleInputChange}
          />
        </div>
        <modalIcons.TbX className="w-6 h-6 hover:text-alert cursor-pointer text-black dark:text-black-0" onClick={handleHabitModal} />
      </div>
      <div className="flex justify-between items-start gap-4">
        <div className="relative flex items-center gap-1 group">
          <label htmlFor="category" className="text-nowrap text-black dark:text-black-0 group-hover:relative">
            習慣類別
            <span className="absolute -bottom-1 left-24 transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              你想要培養什麼類別的習慣呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200" />
        </div>
        <CategorySelect options={habitCategories} value={habitData.category} onChange={(value) => handleInputChange({ target: { name: "category", value } })} />
      </div>
      <div className="flex justify-between gap-4">
        <div className="relative flex items-center gap-1 group">
          <label htmlFor="frequency" className="text-nowrap text-black dark:text-black-0 group-hover:relative">
            習慣頻率
            <span className="absolute -bottom-1 left-24 transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              你想要怎麼安排習慣頻率呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200" />
        </div>
        <div className="w-full grid grid-cols-3 gap-3">
          <div>
            <input type="radio" name="frequency" id="daily" value="daily" className="appearance-none hidden" checked={habitData.frequency.type === "daily"} onChange={handleInputChange} />
            <label
              htmlFor="daily"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border cursor-pointer ${
                habitData.frequency.type === "daily" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              每日
            </label>
          </div>
          <div>
            <input type="radio" name="frequency" id="weekly" value="weekly" className="appearance-none hidden" checked={habitData.frequency.type === "weekly"} onChange={handleInputChange} />
            <label
              htmlFor="weekly"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border cursor-pointer ${
                habitData.frequency.type === "weekly" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light dark:bg-black-100"
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
              onChange={handleInputChange}
            />
            <label
              htmlFor="specificDays"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border cursor-pointer ${
                habitData.frequency.type === "specificDays" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              特定日期
            </label>
          </div>
        </div>
      </div>
      {habitData.frequency.type === "weekly" && (
        <div>
          <p className="font-normal text-sm text-black-500 mb-1">選擇一天作為「是否完成習慣」的確認時間吧！</p>
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="text-center flex flex-col justify-center items-center gap-1 text-black dark:text-black-0">
                {day}
                <checkIcon.TbCheck
                  className={`w-10 h-10 rounded-full p-1 border border-black-500 dark:border-black-300 cursor-pointer ${
                    selectedDays.includes(index) ? "bg-primary text-white border-primary dark:border-primary" : "text-black dark:text-black-0 hover:bg-primary-light"
                  }`}
                  onClick={() => handleWeeklyDayButtonClick(day)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {habitData.frequency.type === "specificDays" && (
        <div>
          <p className="font-normal text-sm text-black-500 mb-1">選擇想要培養習慣的時間吧！</p>
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="text-center flex flex-col justify-center items-center gap-1 text-black dark:text-black-0">
                {day}
                <checkIcon.TbCheck
                  className={`w-10 h-10 rounded-full p-1 border border-black-500 dark:border-black-300 cursor-pointer ${
                    selectedDays.includes(index) ? "bg-primary text-white border-primary dark:border-primary" : "text-black dark:text-black-0 hover:bg-primary-light"
                  }`}
                  onClick={() => handleDayButtonClick(day)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <div className="relative flex items-center gap-1 group">
          <label htmlFor="type" className="text-nowrap text-black dark:text-black-0 group-hover:relative">
            習慣類型
            <span className="absolute -bottom-1 left-24 transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              你想要養成還是戒除呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200" />
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          <div>
            <input type="radio" name="type" id="to-do" value="to-do" className="appearance-none hidden" checked={habitData.type === "to-do"} onChange={handleInputChange} />
            <label
              htmlFor="to-do"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border cursor-pointer ${
                habitData.type === "to-do" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              養成
            </label>
          </div>
          <div>
            <input type="radio" name="type" id="not-to-do" value="not-to-do" className="appearance-none hidden" checked={habitData.type === "not-to-do"} onChange={handleInputChange} />
            <label
              htmlFor="not-to-do"
              className={`font-normal text-sm leading-5 block text-center py-px rounded border cursor-pointer ${
                habitData.type === "not-to-do" ? "bg-primary border-primary" : "bg-black-0 border-black-300 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              戒除
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="relative flex items-center gap-1 group">
          <label htmlFor="amount" className="text-nowrap text-black dark:text-black-0 group-hover:relative">
            習慣罰款
            <span className="absolute -bottom-1 left-24 transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              如果沒完成習慣，你想支付多少罰款呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200" />
        </div>
        <AmountCounter value={habitData.amount} onChange={handleInputChange} />
      </div>
      <div className="flex justify-between gap-4 w-full">
        <div className="relative flex items-center gap-1 group">
          <label htmlFor="time" className="text-nowrap text-black dark:text-black-0 group-hover:relative">
            養成期間
            <span className="absolute -bottom-1 left-24 transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-bottom-2 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark">
              你想要在什麼時候培養這個習慣呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="w-4 h-4 text-black-500 dark:text-black-200" />
        </div>
        <div className="border border-black-300 w-full rounded py-0.5 px-4 flex justify-between items-center bg-black-0 dark:bg-black-100 relative">
          <button className={`text-center w-full font-normal text-sm leading-5 text-black`} onClick={() => setShowMonthCalendar(!showMonthCalendar)}>
            {habitData.startDate && habitData.endDate ? `${habitData.startDate} - ${habitData.endDate}` : "選擇日期範圍"}
          </button>
        </div>
        {showMonthCalendar && (
          <div ref={calendarRef} className="w-3/5 md:w-1/6 absolute bottom-0 md:-bottom-12 2xl:-bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <MonthCalendar date={monthCalendarDate} onSelect={handleMonthCalendarSelectDate} />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <button className="w-full rounded-lg bg-primary font-medium text-sm leading-5 py-1 hover:bg-primary-dark" onClick={handleSubmit}>
          養成習慣
        </button>
      </div>
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
  setCalendarTarget: PropTypes.func.isRequired,
  setShowMonthCalendar: PropTypes.func.isRequired,
};

export default HabitModal;
