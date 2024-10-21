import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { weekCalendarIcons } from "../../assets/icons";

const WeekCalendar = ({ date, onSelect, onWeekChange }) => {
  const [weekNames] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [monthNames] = useState([
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]);
  const [displayDate, setDisplayDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate({
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    });
    setDisplayDate(
      date
        ? { ...date }
        : {
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate(),
          },
    );
  }, [date]);

  useEffect(() => {
    if (displayDate) {
      const firstDayOfWeek = new Date(
        displayDate.year,
        displayDate.month,
        displayDate.day -
          new Date(
            displayDate.year,
            displayDate.month,
            displayDate.day,
          ).getDay(),
      );
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        weekDates.push({
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
        });
      }
      onWeekChange(weekDates);
    }
  }, [displayDate]);

  const daysInWeek = () => {
    if (!displayDate) return [];
    const arr = [];
    const year = displayDate.year;
    const month = displayDate.month;
    const day = displayDate.day;
    const firstDayOfWeek = new Date(
      year,
      month,
      day - new Date(year, month, day).getDay(),
    );
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      arr.push({
        value: date.getDate(),
        year: date.getFullYear(),
        month: date.getMonth(),
      });
    }
    return arr;
  };

  const changePeriod = (dir) => {
    changeWeek(dir);
  };

  const changeWeek = (dir) => {
    setDisplayDate((prev) => {
      const newDate = new Date(
        prev.year,
        prev.month,
        prev.day + (dir ? 7 : -7),
      );
      const firstDayOfWeek = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate() - newDate.getDay(),
      );
      const newSelectedDate = {
        year: firstDayOfWeek.getFullYear(),
        month: firstDayOfWeek.getMonth(),
        day: firstDayOfWeek.getDate(),
      };
      setSelectedDate(newSelectedDate);
      onSelect(newSelectedDate);
      return {
        year: newDate.getFullYear(),
        month: newDate.getMonth(),
        day: newDate.getDate(),
      };
    });
  };

  const selectDate = (date) => {
    const newDate = {
      ...displayDate,
      day: date.value,
      month: date.month,
      year: date.year,
    };
    setSelectedDate(newDate);
    onSelect(newDate);
  };

  const checkCurrentDate = (date) => {
    return (
      date.value === currentDate.day &&
      currentDate.year === date.year &&
      currentDate.month === date.month
    );
  };

  const checkSelectedDate = (date) => {
    return (
      selectedDate &&
      date.value === selectedDate.day &&
      selectedDate.year === date.year &&
      selectedDate.month === date.month
    );
  };

  if (!displayDate) return null;

  const firstDayOfWeek = new Date(
    displayDate.year,
    displayDate.month,
    displayDate.day -
      new Date(displayDate.year, displayDate.month, displayDate.day).getDay(),
  );
  const headerText = `${monthNames[firstDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()}`;

  return (
    <div className="rounded-b-3xl bg-black-50 p-4 dark:bg-black-800 md:pt-6">
      <div className="mb-3 flex justify-between">
        <button onClick={() => changePeriod(false)}>
          <weekCalendarIcons.TbChevronLeft className="h-6 w-6 text-black hover:text-alert dark:text-black-0" />
        </button>
        <h1 className="text-lg font-bold leading-6 text-black dark:text-black-0">
          {headerText}
        </h1>
        <button onClick={() => changePeriod(true)}>
          <weekCalendarIcons.TbChevronRight className="h-6 w-6 text-black hover:text-alert dark:text-black-0" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-x-2 gap-y-1 text-center md:gap-x-4">
        {daysInWeek().map((day, index) => (
          <div
            key={index}
            className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg px-1 py-1 ${
              checkCurrentDate(day)
                ? "bg-primary"
                : checkSelectedDate(day)
                  ? "bg-primary-light outline outline-primary-dark"
                  : "bg-transparent hover:bg-primary-light"
            }`}
            onClick={() => selectDate(day)}
          >
            <div
              className={`text-lg font-bold leading-6 ${checkCurrentDate(day) ? "dark:text-black-0-0 text-black" : checkSelectedDate(day) ? "text-black" : "text-black dark:text-black-0"}`}
            >
              {day.value}
            </div>
            <div
              className={`text-sm font-medium leading-5 ${checkCurrentDate(day) ? "dark:text-black-0-0 text-black" : checkSelectedDate(day) ? "text-black" : "text-black dark:text-black-0"}`}
            >
              {weekNames[new Date(day.year, day.month, day.value).getDay()]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;

WeekCalendar.propTypes = {
  date: PropTypes.object,
  onSelect: PropTypes.func,
  onWeekChange: PropTypes.func.isRequired,
};
