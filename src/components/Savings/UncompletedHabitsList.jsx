import PropTypes from "prop-types";

const UncompletedHabitsList = ({ habits, getStartAndEndOfPeriod, filter }) => {
  const renderUncompletedHabits = (habits, startOfPeriod, endOfPeriod) => {
    const uncompletedHabits = [];

    habits.forEach((habit) => {
      habit.status.forEach((status) => {
        const statusDate = new Date(status.date);
        statusDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (
          statusDate < today &&
          !status.completed &&
          statusDate >= startOfPeriod &&
          statusDate <= endOfPeriod
        ) {
          uncompletedHabits.push({
            id: habit.id,
            title: habit.title,
            date: status.date,
            amount: habit.amount,
          });
        }
      });
    });

    [...uncompletedHabits].sort((a, b) => new Date(b.date) - new Date(a.date));

    return uncompletedHabits.slice(0, 50).map((habit, index) => (
      <li
        key={habit.id + habit.date}
        className="grid grid-cols-5 rounded-lg bg-black-50 px-4 py-2 text-sm font-normal leading-5 hover:bg-black-0 dark:bg-black-800 dark:hover:bg-black-600"
      >
        <p className="text-black dark:text-black-0">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="overflow-scroll text-center text-black dark:text-black-0">
          {new Date(habit.date).toLocaleDateString()}
        </p>
        <p className="col-span-2 truncate text-center text-black dark:text-black-0">
          {habit.title}
        </p>
        <p className="overflow-scroll text-center text-black dark:text-black-0">
          NT${habit.amount}
        </p>
      </li>
    ));
  };

  return (
    <ul className="mt-4 space-y-2">
      <li className="grid grid-cols-5 rounded-lg border border-black-500 px-4 py-2 text-sm font-normal leading-5">
        <p className="text-black dark:text-black-0">編號</p>
        <p className="text-center text-black dark:text-black-0">日期</p>
        <p className="col-span-2 text-center text-black dark:text-black-0">
          習慣名稱
        </p>
        <p className="text-center text-black dark:text-black-0">習慣存款</p>
      </li>
      {renderUncompletedHabits(
        habits,
        getStartAndEndOfPeriod(filter).startOfPeriod,
        getStartAndEndOfPeriod(filter).endOfPeriod,
      )}
    </ul>
  );
};

export default UncompletedHabitsList;

UncompletedHabitsList.propTypes = {
  habits: PropTypes.array.isRequired,
  getStartAndEndOfPeriod: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
};
