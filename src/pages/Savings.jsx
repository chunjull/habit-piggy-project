import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getHabits } from "../services/api";
import TypeChart from "../components/TypeChart";
import CustomSelect from "../components/CustomSelect";
import { modalIcons } from "../assets/icons";
import TabNavigation from "../components/Savings/TabNavigation";
import OverviewSection from "../components/Savings/OverviewSection";
import CategorySection from "../components/Savings/CategorySection";

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
  const customSelectRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customSelectRef.current && !customSelectRef.current.contains(e.target)) {
        customSelectRef.current.closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div className="p-4 md:py-10 space-y-4">
      <TabNavigation isActiveTab={isActiveTab} setIsActiveTab={setIsActiveTab} />
      {isActiveTab === "overview" && (
        <OverviewSection
          completedCount={completedCount}
          savingsCount={savingsCount}
          totalSavings={totalSavings}
          filter={filter}
          setFilter={setFilter}
          options={options}
          chartData={chartData}
          habits={habits}
          getStartAndEndOfPeriod={getStartAndEndOfPeriod}
          customSelectRef={customSelectRef}
        />
      )}
      {isActiveTab === "category" && (
        <div className="space-y-4">
          <CategorySection
            filter={filter}
            setFilter={setFilter}
            options={options}
            savingsCount={savingsCount}
            categoryData={categoryData}
            habitCategories={habitCategories}
            customSelectRef={customSelectRef}
          />
          <div className={`p-4 bg-black-50 dark:bg-black-800 rounded-xl space-y-4 ${savingsCount === 0 ? "min-h-screen" : "h-fit"}`}>
            <div className="flex justify-between items-center">
              <div className="relative group flex items-center flex-grow">
                <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">類型總覽</h2>
                <modalIcons.TbInfoCircle className="w-6 h-6 text-black-500 dark:text-black-200 ml-2 inline-block cursor-help" />
                <span className="absolute top-0 left-[168px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:top-7 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
                  來看看你的習慣類型分布吧！你比較擅長養成還是戒除習慣呢？
                </span>
              </div>
              <div className="relative" ref={customSelectRef}>
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
