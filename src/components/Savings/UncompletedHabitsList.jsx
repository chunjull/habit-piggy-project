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
        if (statusDate < today && !status.completed && statusDate >= startOfPeriod && statusDate <= endOfPeriod) {
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
      <li key={habit.id + habit.date} className="py-2 px-4 grid grid-cols-5 bg-black-50 dark:bg-black-800 rounded-lg font-normal text-sm leading-5 hover:bg-black-0 dark:hover:bg-black-600">
        <p className="text-black dark:text-black-0">{String(index + 1).padStart(2, "0")}</p>
        <p className="text-center text-black dark:text-black-0 overflow-scroll">{new Date(habit.date).toLocaleDateString()}</p>
        <p className="text-center col-span-2 text-black dark:text-black-0 truncate">{habit.title}</p>
        <p className="text-center text-black dark:text-black-0 overflow-scroll">NT${habit.amount}</p>
      </li>
    ));
  };

  return (
    <ul className="space-y-2 mt-4">
      <li className="py-2 px-4 grid grid-cols-5 border border-black-500 rounded-lg font-normal text-sm leading-5">
        <p className="text-black dark:text-black-0">編號</p>
        <p className="text-center text-black dark:text-black-0">日期</p>
        <p className="text-center col-span-2 text-black dark:text-black-0">習慣名稱</p>
        <p className="text-center text-black dark:text-black-0">習慣存款</p>
      </li>
      {renderUncompletedHabits(habits, getStartAndEndOfPeriod(filter).startOfPeriod, getStartAndEndOfPeriod(filter).endOfPeriod)}
    </ul>
  );
};

export default UncompletedHabitsList;

UncompletedHabitsList.propTypes = {
  habits: PropTypes.array.isRequired,
  getStartAndEndOfPeriod: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
};
