import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getHabits } from "../services/api";
import SavingsChart from "../components/SavingsChart";
import CategoryChart from "../components/CategoryChart";
import TypeChart from "../components/TypeChart";
import CustomSelect from "../components/CustomSelect";
import { modalIcons } from "../assets/icons";

function Savings() {
  const [isActiveTab, setIsActiveTab] = useState("overview");
  const [filter, setFilter] = useState("week");
  const [options] = useState([
    { value: "week", label: "本週" },
    { value: "month", label: "本月" },
    { value: "year", label: "本年" },
  ]);
  const [completedCount, setCompletedCount] = useState(0);
  const [savingsCount, setSavingsCount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [typeData, setTypeData] = useState({});
  const [habits, setHabits] = useState([]);
  const { user } = useContext(AuthContext);

  const habitCategories = [
    { id: 0, name: "生產力", color: "#FF6961" },
    { id: 1, name: "個人成長", color: "#FFB480" },
    { id: 2, name: "運動健身", color: "#FFE552" },
    { id: 3, name: "飲食健康", color: "#42D6A4" },
    { id: 4, name: "心靈成長", color: "#08CAD1" },
    { id: 5, name: "手作興趣", color: "#59ADF6" },
    { id: 6, name: "財務管理", color: "#9D94FF" },
    { id: 7, name: "環境生活", color: "#C780E8" },
  ];

  const habitType = [
    { id: "to-do", name: "養成", color: "#B2B814" },
    { id: "not-to-do", name: "戒除", color: "#D14D28" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        const habitsList = await getHabits(user.uid);
        setHabits(habitsList);
        const { startOfPeriod, endOfPeriod } = getStartAndEndOfPeriod(filter);
        const { completed, savings, total, chartData, categoryData, typeData } = calculateStatistics(habitsList, startOfPeriod, endOfPeriod, filter);
        setCompletedCount(completed);
        setSavingsCount(savings);
        setTotalSavings(total);
        setChartData(chartData);
        setCategoryData(categoryData);
        setTypeData(typeData);
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
    let typeData = {};

    const periodData = {};

    if (filter === "week") {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      daysOfWeek.forEach((day) => {
        periodData[day] = 0;
      });
    } else if (filter === "month") {
      const weeksInMonth = Math.ceil((endOfPeriod.getDate() - startOfPeriod.getDate() + 1) / 7);
      for (let i = 1; i <= weeksInMonth; i++) {
        periodData[`Week ${i}`] = 0;
      }
    } else {
      const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      monthsOfYear.forEach((month) => {
        periodData[month] = 0;
      });
    }

    habits.forEach((habit) => {
      habit.status.forEach((status) => {
        const statusDate = new Date(status.date);
        statusDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (statusDate < today && statusDate >= startOfPeriod && statusDate <= endOfPeriod) {
          const periodKey = getPeriodKey(statusDate, filter);
          if (!status.completed) {
            periodData[periodKey] += Number(habit.amount);
            savings += 1;
            total += Number(habit.amount);

            if (!categoryData[habit.category]) {
              categoryData[habit.category] = 0;
            }
            categoryData[habit.category] += 1;

            if (!typeData[habit.type]) {
              typeData[habit.type] = 0;
            }
            typeData[habit.type] += 1;
          } else {
            completed += 1;
          }
        }
      });
    });

    chartData = Object.keys(periodData).map((key) => ({
      name: key,
      存款金額: periodData[key],
    }));

    [...chartData].sort((a, b) => {
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

    return { completed, savings, total, chartData, categoryData, typeData };
  };

  const getPeriodKey = (date, filter) => {
    if (filter === "week") {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (filter === "month") {
      const weekNumber = Math.ceil(date.getDate() / 7);
      return `Week ${weekNumber}`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short" });
    }
  };

  const renderStatistics = ({ completed, savings, total }) => (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex justify-end items-center gap-1">
          <p className="font-bold text-base leading-6 text-black dark:text-black-0">{completed}</p>
          <p className="font-normal text-sm leading-5 text-black dark:text-black-0">次</p>
        </div>
        <p className="font-normal text-xs leading-4 md:text-sm md:leading-5 text-black dark:text-black-0">完成習慣次數</p>
      </div>
      <div>
        <div className="flex justify-end items-center gap-1">
          <p className="font-bold text-base leading-6 text-black dark:text-black-0">{savings}</p>
          <p className="font-normal text-sm leading-5 text-black dark:text-black-0">次</p>
        </div>
        <p className="font-normal text-xs leading-4 md:text-sm md:leading-5 text-black dark:text-black-0">存款次數</p>
      </div>
      <div>
        <div className="flex justify-end items-center gap-1">
          <p className="font-normal text-sm leading-5 text-black dark:text-black-0">NT$</p>
          <p className="font-bold text-base leading-6 text-black dark:text-black-0">{total}</p>
        </div>
        <p className="font-normal text-xs leading-4 md:text-sm md:leading-5 text-black dark:text-black-0">存款金額</p>
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
    <div className="p-4 md:py-10 space-y-4">
      <ul className="grid grid-cols-2 w-full">
        <li
          className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center ${isActiveTab === "overview" ? "bg-primary" : "bg-black-50"}`}
          onClick={() => setIsActiveTab("overview")}
        >
          存款總覽
        </li>
        <li
          className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center ${isActiveTab === "category" ? "bg-primary" : "bg-black-50"}`}
          onClick={() => setIsActiveTab("category")}
        >
          習慣養成總覽
        </li>
      </ul>
      {isActiveTab === "overview" && (
        <div>
          <div className="p-4 bg-black-50 dark:bg-black-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative group flex items-center flex-grow">
                <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">存款總覽</h2>
                <modalIcons.TbInfoCircle className="w-6 h-6 text-black-500 dark:text-black-200 ml-2 inline-block" />
                <span className="absolute top-0 left-32 transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:top-7 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
                  結算時間為每日 23:59:59，存款金額為當日未完成的習慣存款金額總和
                </span>
              </div>
              <div className="relative">
                <CustomSelect options={options} value={filter} onChange={setFilter} />
              </div>
            </div>
            {renderStatistics({ completed: completedCount, savings: savingsCount, total: totalSavings })}
            <div className="w-full h-52">
              <SavingsChart data={chartData} />
            </div>
          </div>
          <ul className="space-y-2 mt-4">
            <li className="py-2 px-4 grid grid-cols-5 border border-black-500 rounded-lg font-normal text-sm leading-5">
              <p className="text-black dark:text-black-0">編號</p>
              <p className="text-center text-black dark:text-black-0">日期</p>
              <p className="text-center col-span-2 text-black dark:text-black-0">習慣名稱</p>
              <p className="text-center text-black dark:text-black-0">習慣存款</p>
            </li>
            {renderUncompletedHabits(habits, getStartAndEndOfPeriod(filter).startOfPeriod, getStartAndEndOfPeriod(filter).endOfPeriod)}
          </ul>
          {savingsCount === 0 && (
            <>
              <p className="text-center mt-2 font-normal text-xs leading-4 md:text-base md:leading-6 text-black dark:text-black-0">找不到相關的存款資料</p>
              <p className="text-center mt-2 font-normal text-xs leading-4 md:text-base md:leading-6 text-black dark:text-black-0">要不要試著培養一些習慣呢？</p>
            </>
          )}
          {savingsCount >= 50 && <p className="text-center mt-2 font-normal text-xs leading-4 md:text-base md:leading-6 text-black dark:text-black-0">僅顯示最新的 50 筆存款記錄</p>}
        </div>
      )}
      {isActiveTab === "category" && (
        <div className="space-y-4">
          <div className={`p-4 bg-black-50 dark:bg-black-800 rounded-xl space-y-4 ${savingsCount === 0 ? "min-h-screen" : "h-fit"}`}>
            <div className="flex justify-between items-center">
              <div className="relative group flex items-center flex-grow">
                <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">類別總覽</h2>
                <modalIcons.TbInfoCircle className="w-6 h-6 text-black-500 dark:text-black-200 ml-2 inline-block" />
                <span className="absolute top-0 left-[168px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:top-7 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
                  來看看你的習慣類別分布吧！哪些類別的習慣讓你累積最多存款呢？
                </span>
              </div>
              <div className="relative">
                <CustomSelect options={options} value={filter} onChange={setFilter} />
              </div>
            </div>
            {savingsCount === 0 ? (
              <div className="space-y-2">
                <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">找不到相關的存款資料</p>
                <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">要不要試著培養一些習慣呢？</p>
              </div>
            ) : (
              <div>
                <div className="w-full h-[400px]">
                  <CategoryChart categoryData={categoryData} habitCategories={habitCategories} />
                </div>
                <ul className="space-y-2">
                  {habitCategories.map((category) => (
                    <li key={category.id} className="p-2 rounded flex justify-between items-center hover:bg-black-0 dark:hover:bg-black-600">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full`} style={{ backgroundColor: category.color }}></div>
                        <p className="font-normal text-base leading-6 text-black dark:text-black-0">{category.name}</p>
                      </div>
                      <p className="font-bold text-lg leading-6 text-black dark:text-black-0">
                        {(((categoryData[category.id] || 0) / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={`p-4 bg-black-50 dark:bg-black-800 rounded-xl space-y-4 ${savingsCount === 0 ? "min-h-screen" : "h-fit"}`}>
            <div className="flex justify-between items-center">
              <div className="relative group flex items-center flex-grow">
                <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">類型總覽</h2>
                <modalIcons.TbInfoCircle className="w-6 h-6 text-black-500 dark:text-black-200 ml-2 inline-block" />
                <span className="absolute top-0 left-[168px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:top-7 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
                  來看看你的習慣類型分布吧！你比較擅長養成還是戒除習慣呢？
                </span>
              </div>
              <div className="relative">
                <CustomSelect options={options} value={filter} onChange={setFilter} />
              </div>
            </div>
            {savingsCount === 0 ? (
              <div className="space-y-2">
                <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">找不到相關的存款資料</p>
                <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">要不要試著培養一些習慣呢？</p>
              </div>
            ) : (
              <div>
                <div className="w-full h-[400px]">
                  <TypeChart typeData={typeData} habitType={habitType} />
                </div>
                <ul className="space-y-2">
                  {habitType.map((type) => (
                    <li key={type.id} className="p-2 rounded flex justify-between items-center hover:bg-black-0 dark:hover:bg-black-600">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full`} style={{ backgroundColor: type.color }}></div>
                        <p className="font-normal text-base leading-6 text-black dark:text-black-0">{type.name}</p>
                      </div>
                      <p className="font-bold text-lg leading-6 text-black dark:text-black-0">{(((typeData[type.id] || 0) / Object.values(typeData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Savings;
