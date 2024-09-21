import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getHabits } from "../services/api";
import SavingsChart from "../components/SavingsChart";
import CategoryChart from "../components/CategoryChart";

function Savings() {
  const [isOverview, setIsOverview] = useState(true);
  const [filter, setFilter] = useState("week");
  const [completedCount, setCompletedCount] = useState(0);
  const [savingsCount, setSavingsCount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [habits, setHabits] = useState([]);
  const { user } = useContext(AuthContext);

  const habitCategories = {
    0: "生產力",
    1: "個人成長",
    2: "運動健身",
    3: "飲食健康",
    4: "心靈成長",
    5: "手作興趣",
    6: "財務管理",
    7: "環境生活",
  };

  const COLORS = ["#FF6961", "#FFB480", "#FFE552", "#42D6A4", "#08CAD1", "#59ADF6", "#9D94FF", "#C780E8"];

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        const habitsList = await getHabits(user.uid);
        setHabits(habitsList);
        const { startOfPeriod, endOfPeriod } = getStartAndEndOfPeriod(filter);
        const { completed, savings, total, chartData, categoryData } = calculateStatistics(habitsList, startOfPeriod, endOfPeriod, filter);
        setCompletedCount(completed);
        setSavingsCount(savings);
        setTotalSavings(total);
        setChartData(chartData);
        setCategoryData(categoryData);
      }
    };
    fetchData();
  }, [user, filter]);

  const getStartAndEndOfPeriod = (filter) => {
    const today = new Date();
    let startOfPeriod, endOfPeriod;

    if (filter === "week") {
      startOfPeriod = new Date(today.setDate(today.getDate() - today.getDay()));
      endOfPeriod = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    } else if (filter === "month") {
      startOfPeriod = new Date(today.getFullYear(), today.getMonth(), 1);
      endOfPeriod = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else {
      startOfPeriod = new Date(today.getFullYear(), 0, 1);
      endOfPeriod = new Date(today.getFullYear(), 11, 31);
    }

    startOfPeriod.setHours(0, 0, 0, 0);
    endOfPeriod.setHours(23, 59, 59, 999);

    return { startOfPeriod, endOfPeriod };
  };

  const calculateStatistics = (habits, startOfPeriod, endOfPeriod, filter) => {
    let completed = 0;
    let savings = 0;
    let total = 0;
    let chartData = [];
    let categoryData = {};

    const periodData = {};

    habits.forEach((habit) => {
      habit.status.forEach((status) => {
        const statusDate = new Date(status.date);
        statusDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (statusDate < today && statusDate >= startOfPeriod && statusDate <= endOfPeriod) {
          const periodKey = getPeriodKey(statusDate, filter);
          if (!periodData[periodKey]) {
            periodData[periodKey] = 0;
          }
          if (!status.completed) {
            periodData[periodKey] += Number(habit.amount);
            savings += 1;
            total += Number(habit.amount);
          } else {
            completed += 1;
          }

          if (!categoryData[habit.category]) {
            categoryData[habit.category] = 0;
          }
          categoryData[habit.category] += 1;
        }
      });
    });

    chartData = Object.keys(periodData).map((key) => ({
      name: key,
      存款金額: periodData[key],
    }));

    chartData.sort((a, b) => {
      if (filter === "week") {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return daysOfWeek.indexOf(a.name) - daysOfWeek.indexOf(b.name);
      } else if (filter === "month") {
        const weekA = parseInt(a.name.split(" ")[1], 10);
        const weekB = parseInt(b.name.split(" ")[1], 10);
        return weekA - weekB;
      } else {
        const monthA = new Date(Date.parse(a.name + " 1, 2022")).getMonth();
        const monthB = new Date(Date.parse(b.name + " 1, 2022")).getMonth();
        return monthA - monthB;
      }
    });

    return { completed, savings, total, chartData, categoryData };
  };

  const getPeriodKey = (date, filter) => {
    if (filter === "week") {
      return date.toLocaleDateString("zh-TW", { weekday: "short" });
    } else if (filter === "month") {
      const weekNumber = Math.ceil(date.getDate() / 7);
      return `Week ${weekNumber}`;
    } else {
      return date.toLocaleDateString("zh-TW", { month: "short" });
    }
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
            <div className="w-full h-52">
              <SavingsChart data={chartData} />
            </div>
          </div>
          <ul className="space-y-2 mt-4">
            <li className="py-2 px-4 grid grid-cols-4 border">
              <p>編號</p>
              <p className="text-center">日期</p>
              <p className="text-center">習慣名稱</p>
              <p className="text-center">習慣存款</p>
            </li>
            {renderUncompletedHabits(habits, getStartAndEndOfPeriod(filter).startOfPeriod, getStartAndEndOfPeriod(filter).endOfPeriod)}
          </ul>
          <p className="text-center mt-2">僅顯示最新的 50 筆存款記錄</p>
        </div>
      ) : (
        <div className="p-4 border space-y-4">
          <div>習慣類別總類</div>
          <div className="w-full h-[400px]">
            <CategoryChart categoryData={categoryData} />
          </div>
          <ul className="space-y-3">
            {Object.keys(habitCategories).map((key, index) => (
              <li key={key} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <p>{habitCategories[key]}</p>
                </div>
                <p>{(((categoryData[key] || 0) / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100).toFixed(2)} %</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Savings;
