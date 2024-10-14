import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { weekCalendarIcons } from "../../assets/icons";

const MonthCalendar = ({ date, onSelect }) => {
  const [weekNames] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [monthNames] = useState(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
  const [displayDate, setDisplayDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);

  useEffect(() => {
    const now = new Date();
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

  if (!displayDate) return null;

  const headerText = `${monthNames[displayDate.month]} ${displayDate.year}`;

  const selectDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date.year, date.month, date.value);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else {
      const startDate = new Date(selectedRange.start.year, selectedRange.start.month, selectedRange.start.value);
      startDate.setHours(0, 0, 0, 0);
      if (startDate.getTime() === selectedDate.getTime()) return;

      setSelectedRange((prev) => ({
        start: prev.start,
        end: date,
      }));
      onSelect({ start: selectedRange.start, end: date });
    }
  };

  const isInRange = (day) => {
    if (!day || !selectedRange.start || !selectedRange.end) return false;
    const date = new Date(day.year, day.month, day.value);
    const start = new Date(selectedRange.start.year, selectedRange.start.month, selectedRange.start.value);
    const end = new Date(selectedRange.end.year, selectedRange.end.month, selectedRange.end.value);
    return date >= start && date <= end;
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(day.year, day.month, day.value);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (day) => {
    if (!day) return false;
    const date = new Date(day.year, day.month, day.value);
    const start = selectedRange.start ? new Date(selectedRange.start.year, selectedRange.start.month, selectedRange.start.value) : null;
    const end = selectedRange.end ? new Date(selectedRange.end.year, selectedRange.end.month, selectedRange.end.value) : null;
    return (start && date.getTime() === start.getTime()) || (end && date.getTime() === end.getTime());
  };

  const isInHoverRange = (day) => {
    if (!day || !selectedRange.start || !hoverDate) return false;
    const date = new Date(day.year, day.month, day.value);
    const start = new Date(selectedRange.start.year, selectedRange.start.month, selectedRange.start.value);
    const end = new Date(hoverDate.year, hoverDate.month, hoverDate.value);
    return date > start && date < end;
  };

  return (
    <div className="p-4 bg-light dark:bg-black-800 rounded-2xl">
      <div className="flex justify-between mb-3">
        <button onClick={() => changePeriod(false)}>
          <weekCalendarIcons.TbChevronLeft className="w-6 h-6 text-black dark:text-black-0 hover:text-alert" />
        </button>
        <h1 className="font-bold text-base leading-6 text-black dark:text-black-0">{headerText}</h1>
        <button onClick={() => changePeriod(true)}>
          <weekCalendarIcons.TbChevronRight className="w-6 h-6 text-black dark:text-black-0 hover:text-alert" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center gap-1">
        {weekNames.map((name, index) => (
          <div key={index} className="font-medium text-sm leading-5 text-black dark:text-black-0">
            {name}
          </div>
        ))}
        {daysInMonth().map((day, index) => (
          <div
            key={index}
            className={`rounded-full aspect-square flex items-center justify-center cursor-pointer ${
              !day
                ? "invisible"
                : isPastDate(day)
                ? "bg-black-200 cursor-not-allowed"
                : isSelected(day)
                ? "bg-primary"
                : isInHoverRange(day)
                ? "bg-primary-light"
                : isInRange(day)
                ? "bg-primary-dark text-black-0"
                : "bg-white hover:bg-primary-light hover:outline hover:outline-2 hover:outline-primary-dark"
            }`}
            onClick={() => day && !isPastDate(day) && selectDate(day)}
            onMouseEnter={() => day && setHoverDate(day)}
            onMouseLeave={() => setHoverDate(null)}
          >
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
