import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { weekCalendarIcons } from "../assets/icons";

const MonthCalendar = ({ date, onSelect }) => {
  const [weekNames] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [monthNames] = useState(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
  const [displayDate, setDisplayDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

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
          }
    );
  }, [date]);

  const daysInMonth = () => {
    if (!displayDate) return [];
    const arr = [];
    const year = displayDate.year;
    const month = displayDate.month;
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      arr.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      arr.push({
        value: i,
        year: year,
        month: month,
      });
    }

    return arr;
  };

  const changePeriod = (dir) => {
    changeMonth(dir);
  };

  const changeMonth = (dir) => {
    setDisplayDate((prev) => {
      const newDate = new Date(prev.year, prev.month + (dir ? 1 : -1), 1);
      return { year: newDate.getFullYear(), month: newDate.getMonth(), day: newDate.getDate() };
    });
  };

  const selectDate = (date) => {
    const newDate = { ...displayDate, day: date.value, month: date.month, year: date.year };
    onSelect(newDate);
  };

  const checkCurrentDate = (date) => {
    return date && date.value === currentDate.day && currentDate.year === date.year && currentDate.month === date.month;
  };

  if (!displayDate) return null;

  const headerText = `${monthNames[displayDate.month]} ${displayDate.year}`;

  return (
    <div className="p-4 bg-slate-300">
      <div className="flex justify-between mb-3">
        <button onClick={() => changePeriod(false)}>
          <weekCalendarIcons.TbChevronLeft className="w-6 h-6" />
        </button>
        <h1>{headerText}</h1>
        <button onClick={() => changePeriod(true)}>
          <weekCalendarIcons.TbChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {weekNames.map((name, index) => (
          <div key={index} className="font-bold">
            {name}
          </div>
        ))}
        {daysInMonth().map((day, index) => (
          <div key={index} className={`border-t border-r flex items-center justify-center bg-white ${checkCurrentDate(day) ? "bg-yellow-500" : ""}`} onClick={() => day && selectDate(day)}>
            {day ? day.value : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthCalendar;

MonthCalendar.propTypes = {
  date: PropTypes.object,
  onSelect: PropTypes.func,
};
