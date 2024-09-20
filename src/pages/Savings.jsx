import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getHabits } from "../services/api";

function Savings() {
  const [isOverview, setIsOverview] = useState(true);
  const [filter, setFilter] = useState("week");
  const [completedCount, setCompletedCount] = useState(0);
  const [savingsCount, setSavingsCount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [habits, setHabits] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const habitsList = await getHabits(user.uid);
      setHabits(habitsList);
      const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
      const { completed, savings, total } = calculateStatistics(habitsList, startOfWeek, endOfWeek);
      setCompletedCount(completed);
      setSavingsCount(savings);
      setTotalSavings(total);
    };
    fetchData();
  }, [user, filter]);

  const getStartAndEndOfWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  };

  const calculateStatistics = (habits, startOfPeriod, endOfPeriod) => {
    let completed = 0;
    let savings = 0;
    let total = 0;

    habits.forEach((habit) => {
      const uncompletedCount = habit.status.filter((status) => {
        const statusDate = new Date(status.date);
        statusDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return statusDate < today && !status.completed;
      }).length;
      savings += uncompletedCount;

      const uncompletedFine = uncompletedCount * habit.amount;
      if (uncompletedFine > 0) {
        total += uncompletedFine;
      }

      const completedCount = habit.status.filter((status) => {
        const statusDate = new Date(status.date);
        return status.completed && statusDate >= startOfPeriod && statusDate <= endOfPeriod;
      }).length;
      completed += completedCount;
    });

    return { completed, savings, total };
  };

  const renderStatistics = ({ completed, savings, total }) => (
    <div className="flex justify-between items-center">
      <div className="text-end">
        <p>{completed} 次</p>
        <p>完成習慣次數</p>
      </div>
      <div className="text-end">
        <p>{savings} 次</p>
        <p>存款次數</p>
      </div>
      <div className="text-end">
        <p>NT${total}</p>
        <p>存款金額</p>
      </div>
    </div>
  );

  const filterHabits = (habits, filter) => {
    const today = new Date();
    let startOfPeriod, endOfPeriod;

    if (filter === "week") {
      startOfPeriod = new Date(today.setDate(today.getDate() - today.getDay()));
      endOfPeriod = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    } else if (filter === "month") {
      startOfPeriod = new Date(today.getFullYear(), today.getMonth(), 1);
      endOfPeriod = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else {
      startOfPeriod = new Date(0);
      endOfPeriod = new Date();
    }

    startOfPeriod.setHours(0, 0, 0, 0);
    endOfPeriod.setHours(23, 59, 59, 999);

    const filteredHabits = habits.filter((habit) => {
      return habit.status.some((status) => {
        const statusDate = new Date(status.date);
        return statusDate >= startOfPeriod && statusDate <= endOfPeriod;
      });
    });

    return filteredHabits;
  };

  const renderUncompletedHabits = (habits) => {
    const uncompletedHabits = [];

    habits.forEach((habit) => {
      habit.status.forEach((status) => {
        const statusDate = new Date(status.date);
        statusDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (statusDate < today && !status.completed) {
          uncompletedHabits.push({
            id: habit.id,
            title: habit.title,
            date: status.date,
            amount: habit.amount,
          });
        }
      });
    });

    uncompletedHabits.sort((a, b) => new Date(b.date) - new Date(a.date));

    return uncompletedHabits.slice(0, 50).map((habit, index) => (
      <li key={habit.id + habit.date} className="py-2 px-4 grid grid-cols-4 bg-slate-300">
        <p>{String(index + 1).padStart(2, "0")}</p>
        <p className="text-center">{new Date(habit.date).toLocaleDateString()}</p>
        <p className="text-center">{habit.title}</p>
        <p className="text-center">NT${habit.amount}</p>
      </li>
    ));
  };

  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <ul className="grid grid-cols-2 w-full">
        <li className={`border p-2 text-center ${isOverview ? "bg-gray-200" : ""}`} onClick={() => setIsOverview(true)}>
          存款總覽
        </li>
        <li className={`border p-2 text-center ${!isOverview ? "bg-gray-200" : ""}`} onClick={() => setIsOverview(false)}>
          習慣類別總覽
        </li>
      </ul>
      {isOverview ? (
        <div>
          <div className="p-4 border space-y-4">
            <div className="flex justify-between items-center">
              <h2>存款總覽</h2>
              <select className="border" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="week">本週</option>
                <option value="month">本月</option>
                <option value="all">全部</option>
              </select>
            </div>
            {renderStatistics({ completed: completedCount, savings: savingsCount, total: totalSavings })}
            <div className="w-full h-52 bg-slate-100">Chart...</div>
          </div>
          <ul className="space-y-2 mt-4">
            <li className="py-2 px-4 grid grid-cols-4 border">
              <p>編號</p>
              <p className="text-center">日期</p>
              <p className="text-center">習慣名稱</p>
              <p className="text-center">習慣存款</p>
            </li>
            {renderUncompletedHabits(filterHabits(habits, filter))}
          </ul>
          <p className="text-center mt-2">僅顯示最新的 50 筆存款記錄</p>
        </div>
      ) : (
        <div>Category</div>
      )}
    </div>
  );
}

export default Savings;
