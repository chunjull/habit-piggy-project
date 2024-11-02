import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { checkIcon, habitDetailIcon, modalIcons } from "../../assets/icons";

const HabitList = ({
  habits,
  habitCategories,
  handleDetailClick,
  weekDates,
  handleCheck,
}) => {
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
          <p className="text-center text-base font-normal leading-6 text-black dark:text-black-0">
            找不到相關的存款資料
          </p>
          <p className="text-center text-base font-normal leading-6 text-black dark:text-black-0">
            要不要試著培養一些習慣呢？
          </p>
        </div>
      ) : (
        <ul
          className={`mt-2 space-y-4 ${location.pathname === "/Home" ? "p-4" : ""}`}
        >
          {Array.isArray(habits) &&
            habits.map((habit) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const endDate = new Date(habit.endDate);
              endDate.setHours(0, 0, 0, 0);
              const isFinished = endDate < today;

              const habitCategory = habitCategories.find(
                (category) => category.id === habit.category,
              );
              const HabitIcon = habitCategory ? habitCategory.icon : null;

              return (
                <li
                  key={habit.id}
                  className={`rounded-2xl p-4 ${
                    isFinished
                      ? "bg-black-300 hover:bg-black-200 dark:bg-black-800 dark:hover:bg-black-900"
                      : "bg-black-50 hover:bg-black-0 dark:bg-black-500 dark:hover:bg-black-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                        {HabitIcon && <HabitIcon className="h-8 w-8" />}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="line-clamp-1 text-base font-bold leading-6 text-black dark:text-black-0">
                          {habit.title}
                        </h3>
                        <div className="flex">
                          <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
                            {renderType(habit.type)}｜罰款 ${habit.amount}
                            ｜已達成{" "}
                            {
                              habit.status.filter((status) => status.completed)
                                .length
                            }
                          </p>
                          <p className="text-sm font-normal leading-5 text-black-500 dark:text-black-300">
                            /{habit.status.length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-black hover:text-alert dark:text-black-0"
                      onClick={() => handleDetailClick(habit)}
                    >
                      <habitDetailIcon.TbCalendarSmile className="h-6 w-6 md:h-8 md:w-8" />
                    </button>
                  </div>
                  {weekDates && (
                    <div className="grid grid-cols-7 gap-y-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day, index) => (
                          <div
                            key={index}
                            className="text-center text-sm leading-5 text-black dark:text-black-0 md:text-base md:font-normal md:leading-6"
                          >
                            {day}
                          </div>
                        ),
                      )}
                      {weekDates.map((date, index) => {
                        const status = habit.status.find(
                          (s) =>
                            new Date(s.date).toDateString() ===
                            new Date(
                              date.year,
                              date.month,
                              date.day,
                            ).toDateString(),
                        );
                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            {status ? (
                              isFinished && !status.completed ? (
                                <modalIcons.TbX className="h-10 w-10 cursor-not-allowed rounded-full border-2 border-alert bg-alert text-black-0 md:h-12 md:w-12" />
                              ) : (
                                <checkIcon.TbCheck
                                  className={`h-10 w-10 rounded-full border-2 md:h-12 md:w-12 ${
                                    status.completed
                                      ? "border-primary bg-primary text-black-0"
                                      : "border-black-500 text-black-500 dark:border-black-300 dark:text-black-0"
                                  } ${isFinished ? "cursor-not-allowed" : "cursor-pointer hover:bg-primary-light"}`}
                                  onClick={() =>
                                    !isFinished &&
                                    status &&
                                    handleCheck(habit.id, status.date)
                                  }
                                  disabled={!status}
                                />
                              )
                            ) : (
                              <div
                                className={`h-10 w-10 cursor-not-allowed rounded-full border-2 border-dashed md:h-12 md:w-12 ${
                                  isFinished
                                    ? "bg-black-transparent border-black-500"
                                    : "border-black-300 bg-transparent"
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
