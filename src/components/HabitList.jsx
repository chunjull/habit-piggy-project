import PropTypes from "prop-types";
import { checkIcon, habitDetailIcon } from "../assets/icons";
import { useLocation } from "react-router-dom";

const HabitList = ({ habits, habitCategories, handleDetailClick, weekDates, handleCheck }) => {
  const location = useLocation();

  const renderFrequency = (frequency) => {
    switch (frequency.type) {
      case "daily":
        return "每天";
      case "weekly":
        return "每週";
      case "specificDays":
        return `特定日期`;
      default:
        return "";
    }
  };

  return (
    <ul className={`space-y-4 mt-2 ${location.pathname === "/home" ? "p-4" : ""}`}>
      {Array.isArray(habits) &&
        habits.map((habit) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const endDate = new Date(habit.endDate);
          endDate.setHours(0, 0, 0, 0);
          const isFinished = endDate < today;

          const habitCategory = habitCategories.find((category) => category.id === habit.category);
          const HabitIcon = habitCategory ? habitCategory.icon : null;

          return (
            <li key={habit.id} className={`p-4 rounded-2xl ${isFinished ? "bg-black-300 hover:bg-black-200" : "bg-black-50 hover:bg-black-0"}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">{HabitIcon && <HabitIcon className="w-8 h-8" />}</div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-base leading-6">{habit.title}</h3>
                    <div className="flex">
                      <p className="font-normal text-sm leading-5">
                        {renderFrequency(habit.frequency)}｜罰款 ${habit.amount}｜已達成 {habit.status.filter((status) => status.completed).length}
                      </p>
                      <p className="text-black-500 font-normal text-sm leading-5">/{habit.status.length}</p>
                    </div>
                  </div>
                </div>
                <button className="text-black hover:text-alert" onClick={() => handleDetailClick(habit)}>
                  <habitDetailIcon.TbCalendarSmile className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
              {weekDates && (
                <div className="grid grid-cols-7 gap-y-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div key={index} className="text-center text-sm leading-5 md:font-normal md:text-base md:leading-6">
                      {day}
                    </div>
                  ))}
                  {weekDates.map((date, index) => {
                    const status = habit.status.find((s) => new Date(s.date).toDateString() === new Date(date.year, date.month, date.day).toDateString());
                    return (
                      <div key={index} className="flex flex-col items-center">
                        {status ? (
                          <checkIcon.TbCheck
                            className={`w-10 h-10 md:w-12 md:h-12 cursor-pointer border-2 rounded-full ${
                              status && status.completed ? "bg-primary text-black-0 border-primary" : "text-black-500 border-black-500 hover:bg-primary-light"
                            }`}
                            onClick={() => status && handleCheck(habit.id, status.date)}
                            disabled={!status}
                          />
                        ) : (
                          <checkIcon.TbCheck className="w-10 h-10 md:w-12 md:h-12 bg-black-200 text-black-50 rounded-full cursor-not-allowed" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
    </ul>
  );
};

HabitList.propTypes = {
  habits: PropTypes.array.isRequired,
  habitCategories: PropTypes.array.isRequired,
  handleDetailClick: PropTypes.func.isRequired,
  weekDates: PropTypes.array,
  handleCheck: PropTypes.func,
};

export default HabitList;
