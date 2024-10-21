import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { checkIcon, modalIcons } from "../../assets/icons";
import AmountCounter from "./AmountCounter";
import CategorySelect from "./CategorySelect";
import MonthCalendar from "./MonthCalendar";
import { AlertNotify } from "./ToastNotify";

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
  const [selectedDays, setSelectedDays] = useState(
    habitData.frequency.days || [],
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSelectedDays(habitData.frequency.days || []);
  }, [habitData.frequency.days]);

  const handleDayButtonClick = (day) => {
    const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
      day,
    );
    const newSelectedDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((d) => d !== dayIndex)
      : [...selectedDays, dayIndex];
    setSelectedDays(newSelectedDays);
    setHabitData((prevData) => ({
      ...prevData,
      frequency: { ...prevData.frequency, days: newSelectedDays },
    }));
  };

  const handleWeeklyDayButtonClick = (day) => {
    const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
      day,
    );
    setSelectedDays([dayIndex]);
    setHabitData((prevData) => ({
      ...prevData,
      frequency: { ...prevData.frequency, day: dayIndex },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!habitData.title) newErrors.title = "請輸入習慣名稱";
    if (!habitData.category && habitData.category !== 0)
      newErrors.category = "請選擇習慣類別";
    if (!habitData.frequency.type) newErrors.frequency = "請選擇習慣頻率";
    if (
      habitData.frequency.type === "specificDays" &&
      selectedDays.length === 0
    )
      newErrors.days = "請選擇至少一天";
    if (!habitData.type) newErrors.type = "請選擇習慣類型";
    if (!habitData.amount) newErrors.amount = "請輸入罰款金額";
    if (!habitData.startDate) newErrors.startDate = "請選擇開始日期";
    if (!habitData.endDate) newErrors.endDate = "請選擇結束日期";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!habitData.title.trim()) {
      AlertNotify.habitTitleErrorNotify();
      return;
    }

    if (!validateForm()) {
      AlertNotify.addHabitErrorNotify();
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex w-full items-center gap-4">
          <input
            type="text"
            name="title"
            placeholder="輸入習慣名稱"
            className="w-full rounded-xl border px-4 py-1.5 text-sm font-normal leading-5 placeholder-black caret-primary-dark focus:border-primary-dark focus:outline focus:outline-primary-dark dark:bg-black-100"
            value={habitData.title}
            onChange={handleInputChange}
          />
        </div>
        <modalIcons.TbX
          className="h-6 w-6 cursor-pointer text-black hover:text-alert dark:text-black-0"
          onClick={handleHabitModal}
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="group relative flex items-center gap-1">
          <label
            htmlFor="category"
            className="text-nowrap text-black group-hover:relative dark:text-black-0"
          >
            習慣類別
            <span className="pointer-events-none absolute -bottom-1 left-24 z-50 w-fit -translate-x-0 transform rounded bg-primary-dark p-2 text-xs text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
              你想要培養什麼類別的習慣呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="h-4 w-4 text-black-500 dark:text-black-200" />
        </div>
        <CategorySelect
          options={habitCategories}
          value={habitData.category}
          onChange={(value) =>
            handleInputChange({ target: { name: "category", value } })
          }
        />
      </div>
      <div className="flex justify-between gap-4">
        <div className="group relative flex items-center gap-1">
          <label
            htmlFor="frequency"
            className="text-nowrap text-black group-hover:relative dark:text-black-0"
          >
            習慣頻率
            <span className="pointer-events-none absolute -bottom-1 left-24 w-fit -translate-x-0 transform rounded bg-primary-dark p-2 text-xs text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
              你想要怎麼安排習慣頻率呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="h-4 w-4 text-black-500 dark:text-black-200" />
        </div>
        <div className="grid w-full grid-cols-3 gap-3">
          <div>
            <input
              type="radio"
              name="frequency"
              id="daily"
              value="daily"
              className="hidden appearance-none"
              checked={habitData.frequency.type === "daily"}
              onChange={handleInputChange}
            />
            <label
              htmlFor="daily"
              className={`block cursor-pointer rounded border py-px text-center text-sm font-normal leading-5 ${
                habitData.frequency.type === "daily"
                  ? "border-primary bg-primary"
                  : "border-black-300 bg-black-0 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              每日
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="frequency"
              id="weekly"
              value="weekly"
              className="hidden appearance-none"
              checked={habitData.frequency.type === "weekly"}
              onChange={handleInputChange}
            />
            <label
              htmlFor="weekly"
              className={`block cursor-pointer rounded border py-px text-center text-sm font-normal leading-5 ${
                habitData.frequency.type === "weekly"
                  ? "border-primary bg-primary"
                  : "border-black-300 bg-black-0 hover:bg-primary-light dark:bg-black-100"
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
              className="hidden appearance-none"
              checked={habitData.frequency.type === "specificDays"}
              onChange={handleInputChange}
            />
            <label
              htmlFor="specificDays"
              className={`block cursor-pointer rounded border py-px text-center text-sm font-normal leading-5 ${
                habitData.frequency.type === "specificDays"
                  ? "border-primary bg-primary"
                  : "border-black-300 bg-black-0 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              特定日期
            </label>
          </div>
        </div>
      </div>
      {habitData.frequency.type === "weekly" && (
        <div>
          <p className="mb-1 text-sm font-normal text-black-500">
            選擇一天作為「是否完成習慣」的確認時間吧！
          </p>
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-1 text-center text-black dark:text-black-0"
                >
                  {day}
                  <checkIcon.TbCheck
                    className={`h-10 w-10 cursor-pointer rounded-full border border-black-500 p-1 dark:border-black-300 ${
                      selectedDays.includes(index)
                        ? "border-primary bg-primary text-white dark:border-primary"
                        : "text-black hover:bg-primary-light dark:text-black-0"
                    }`}
                    onClick={() => handleWeeklyDayButtonClick(day)}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      )}
      {habitData.frequency.type === "specificDays" && (
        <div>
          <p className="mb-1 text-sm font-normal text-black-500">
            選擇想要培養習慣的時間吧！
          </p>
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-1 text-center text-black dark:text-black-0"
                >
                  {day}
                  <checkIcon.TbCheck
                    className={`h-10 w-10 cursor-pointer rounded-full border border-black-500 p-1 dark:border-black-300 ${
                      selectedDays.includes(index)
                        ? "border-primary bg-primary text-white dark:border-primary"
                        : "text-black hover:bg-primary-light dark:text-black-0"
                    }`}
                    onClick={() => handleDayButtonClick(day)}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <div className="group relative flex items-center gap-1">
          <label
            htmlFor="type"
            className="text-nowrap text-black group-hover:relative dark:text-black-0"
          >
            習慣類型
            <span className="pointer-events-none absolute -bottom-1 left-24 w-fit -translate-x-0 transform rounded bg-primary-dark p-2 text-xs text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
              你想要養成還是戒除呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="h-4 w-4 text-black-500 dark:text-black-200" />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <div>
            <input
              type="radio"
              name="type"
              id="to-do"
              value="to-do"
              className="hidden appearance-none"
              checked={habitData.type === "to-do"}
              onChange={handleInputChange}
            />
            <label
              htmlFor="to-do"
              className={`block cursor-pointer rounded border py-px text-center text-sm font-normal leading-5 ${
                habitData.type === "to-do"
                  ? "border-primary bg-primary"
                  : "border-black-300 bg-black-0 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              養成
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="type"
              id="not-to-do"
              value="not-to-do"
              className="hidden appearance-none"
              checked={habitData.type === "not-to-do"}
              onChange={handleInputChange}
            />
            <label
              htmlFor="not-to-do"
              className={`block cursor-pointer rounded border py-px text-center text-sm font-normal leading-5 ${
                habitData.type === "not-to-do"
                  ? "border-primary bg-primary"
                  : "border-black-300 bg-black-0 hover:bg-primary-light dark:bg-black-100"
              }`}
            >
              戒除
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="group relative flex items-center gap-1">
          <label
            htmlFor="amount"
            className="text-nowrap text-black group-hover:relative dark:text-black-0"
          >
            習慣罰款
            <span className="pointer-events-none absolute -bottom-1 left-24 w-fit -translate-x-0 transform rounded bg-primary-dark p-2 text-xs text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
              如果沒完成習慣，你想支付多少罰款呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="h-4 w-4 text-black-500 dark:text-black-200" />
        </div>
        <AmountCounter value={habitData.amount} onChange={handleInputChange} />
      </div>
      <div className="flex w-full justify-between gap-4">
        <div className="group relative flex items-center gap-1">
          <label
            htmlFor="time"
            className="text-nowrap text-black group-hover:relative dark:text-black-0"
          >
            養成期間
            <span className="pointer-events-none absolute -bottom-1 left-24 z-50 w-fit -translate-x-0 transform rounded bg-primary-dark p-2 text-xs text-white opacity-0 transition-opacity before:absolute before:-bottom-2 before:-left-4 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
              你想要在什麼時候培養這個習慣呢？
            </span>
          </label>
          <modalIcons.TbInfoCircle className="h-4 w-4 text-black-500 dark:text-black-200" />
        </div>
        <div className="relative flex w-full items-center justify-between rounded border border-black-300 bg-black-0 px-4 py-0.5 dark:bg-black-100">
          <button
            className={`w-full text-center text-sm font-normal leading-5 text-black`}
            onClick={() => setShowMonthCalendar(!showMonthCalendar)}
          >
            {habitData.startDate && habitData.endDate
              ? `${habitData.startDate} - ${habitData.endDate}`
              : "選擇日期範圍"}
          </button>
        </div>
        {showMonthCalendar && (
          <div
            ref={calendarRef}
            className="absolute bottom-0 left-1/2 z-10 w-3/5 -translate-x-1/2 -translate-y-1/2 transform md:-bottom-12 md:w-1/6 2xl:-bottom-16"
          >
            <MonthCalendar
              date={monthCalendarDate}
              onSelect={handleMonthCalendarSelectDate}
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        {errors.title && (
          <p className="text-sm leading-5 text-alert">{errors.title}</p>
        )}
        {errors.category && (
          <p className="text-sm leading-5 text-alert">{errors.category}</p>
        )}
        {errors.frequency && (
          <p className="text-sm leading-5 text-alert">{errors.frequency}</p>
        )}
        {errors.days && (
          <p className="text-sm leading-5 text-alert">{errors.days}</p>
        )}
        {errors.type && (
          <p className="text-sm leading-5 text-alert">{errors.type}</p>
        )}
        {errors.amount && (
          <p className="text-sm leading-5 text-alert">{errors.amount}</p>
        )}
        {errors.startDate && (
          <p className="text-sm leading-5 text-alert">{errors.startDate}</p>
        )}
        {errors.endDate && (
          <p className="text-sm leading-5 text-alert">{errors.endDate}</p>
        )}
        <button
          className="w-full rounded-lg bg-primary py-1 text-sm font-medium leading-5 hover:bg-primary-dark"
          onClick={handleSubmit}
        >
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
  showMonthCalendar: PropTypes.bool.isRequired,
  calendarRef: PropTypes.object.isRequired,
  handleHabitModal: PropTypes.func.isRequired,
  habitCategories: PropTypes.array.isRequired,
  setHabitData: PropTypes.func,
  monthCalendarDate: PropTypes.object,
  handleMonthCalendarSelectDate: PropTypes.func.isRequired,
  setCalendarTarget: PropTypes.func,
  setShowMonthCalendar: PropTypes.func,
};

export default HabitModal;
