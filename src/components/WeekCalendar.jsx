import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const WeekCalendar = ({ date, onSelect, onWeekChange }) => {
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

  useEffect(() => {
    if (displayDate) {
      const firstDayOfWeek = new Date(displayDate.year, displayDate.month, displayDate.day - new Date(displayDate.year, displayDate.month, displayDate.day).getDay());
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
  }, [displayDate, onWeekChange]);

  const daysInWeek = () => {
    if (!displayDate) return [];
    const arr = [];
    const year = displayDate.year;
    const month = displayDate.month;
    const day = displayDate.day;
    const firstDayOfWeek = new Date(year, month, day - new Date(year, month, day).getDay());
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
      const newDate = new Date(prev.year, prev.month, prev.day + (dir ? 7 : -7));
      return { year: newDate.getFullYear(), month: newDate.getMonth(), day: newDate.getDate() };
    });
  };

  const selectDate = (date) => {
    const newDate = { ...displayDate, day: date.value, month: date.month, year: date.year };
    onSelect(newDate);
  };

  const checkCurrentDate = (date) => {
    return date.value === currentDate.day && currentDate.year === date.year && currentDate.month === date.month;
  };

  if (!displayDate) return null;

  const firstDayOfWeek = new Date(displayDate.year, displayDate.month, displayDate.day - new Date(displayDate.year, displayDate.month, displayDate.day).getDay());
  const headerText = `${monthNames[firstDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()}`;

  return (
    <div className="p-4 bg-slate-300 mb-6">
      <div className="flex justify-between mb-3">
        <button onClick={() => changePeriod(false)}>prev</button>
        <h1>{headerText}</h1>
        <button onClick={() => changePeriod(true)}>next</button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {weekNames.map((name, index) => (
          <div key={index} className="font-bold">
            {name}
          </div>
        ))}
        {daysInWeek().map((day, index) => (
          <div key={index} className={`border-t border-r flex items-center justify-center bg-white ${checkCurrentDate(day) ? "bg-yellow-500" : ""}`} onClick={() => selectDate(day)}>
            {day.value}
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
