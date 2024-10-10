import PropTypes from "prop-types";
import { checkIcon, habitDetailIcon, modalIcons } from "../assets/icons";
import { useLocation } from "react-router-dom";

const HabitList = ({ habits, habitCategories, handleDetailClick, weekDates, handleCheck }) => {
  const location = useLocation();

  const renderType = (type) => {
    switch (type) {
      case "to-do":
        return "養成";
      case "not-to-do":
        return "戒除";
      default:
        return "";
    }
  };

  return (
    <>
      {Array.isArray(habits) && habits.length === 0 ? (
        <div className="space-y-2 py-6">
          <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">找不到相關的存款資料</p>
          <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">要不要試著培養一些習慣呢？</p>
        </div>
      ) : (
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
                <li
                  key={habit.id}
                  className={`p-4 rounded-2xl ${
                    isFinished ? "bg-black-300 hover:bg-black-200 dark:bg-black-800 dark:hover:bg-black-900" : "bg-black-50 dark:bg-black-500 hover:bg-black-0 dark:hover:bg-black-600"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">{HabitIcon && <HabitIcon className="w-8 h-8" />}</div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-base leading-6 text-black dark:text-black-0">{habit.title}</h3>
                        <div className="flex">
                          <p className="font-normal text-sm leading-5 text-black dark:text-black-0">
                            {renderType(habit.type)}｜罰款 ${habit.amount}｜已達成 {habit.status.filter((status) => status.completed).length}
                          </p>
                          <p className="text-black-500 dark:text-black-300 font-normal text-sm leading-5">/{habit.status.length}</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-black dark:text-black-0 hover:text-alert" onClick={() => handleDetailClick(habit)}>
                      <habitDetailIcon.TbCalendarSmile className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                  </div>
                  {weekDates && (
                    <div className="grid grid-cols-7 gap-y-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                        <div key={index} className="text-center text-sm leading-5 md:font-normal md:text-base md:leading-6 text-black dark:text-black-0">
                          {day}
                        </div>
                      ))}
                      {weekDates.map((date, index) => {
                        const status = habit.status.find((s) => new Date(s.date).toDateString() === new Date(date.year, date.month, date.day).toDateString());
                        return (
                          <div key={index} className="flex flex-col items-center">
                            {status ? (
                              isFinished && !status.completed ? (
                                <modalIcons.TbX className="w-10 h-10 md:w-12 md:h-12 border-2 rounded-full bg-alert text-black-0 border-alert cursor-not-allowed" />
                              ) : (
                                <checkIcon.TbCheck
                                  className={`w-10 h-10 md:w-12 md:h-12 border-2 rounded-full ${
                                    status.completed ? "bg-primary text-black-0 border-primary" : "text-black-500 dark:text-black-0 border-black-500 dark:border-black-300"
                                  } ${isFinished ? "cursor-not-allowed" : "cursor-pointer hover:bg-primary-light"}`}
                                  onClick={() => !isFinished && status && handleCheck(habit.id, status.date)}
                                  disabled={!status}
                                />
                              )
                            ) : (
                              <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full cursor-not-allowed border-2 border-dashed ${
                                  isFinished ? "bg-black-transparent border-black-500" : "bg-transparent border-black-300"
                                }`}
                              />
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
      )}
    </>
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
