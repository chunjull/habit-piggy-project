import { useContext, useEffect, useReducer, useRef, useState } from "react";
import CategorySection from "../components/Savings/CategorySection";
import OverviewSection from "../components/Savings/OverviewSection";
import TabNavigation from "../components/Savings/TabNavigation";
import TypeSection from "../components/Savings/TypeSection";
import { getHabits } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { actionTypes, initialState, reducer } from "../utils/HabitReducer";

function Savings() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isActiveTab, setIsActiveTab] = useState("overview");
  const [filter, setFilter] = useState("week");
  const [options] = useState([
    { value: "week", label: "本週" },
    { value: "month", label: "本月" },
    { value: "year", label: "本年" },
  ]);
  const { user } = useContext(AuthContext);
  const customSelectRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        const habitsList = await getHabits(user.uid);
        dispatch({ type: actionTypes.SET_HABITS, payload: habitsList });
        const { startOfPeriod, endOfPeriod } = getStartAndEndOfPeriod(filter);
        const { completed, savings, total, chartData, categoryData, typeData } =
          calculateStatistics(habitsList, startOfPeriod, endOfPeriod, filter);
        dispatch({ type: actionTypes.SET_COMPLETED_COUNT, payload: completed });
        dispatch({ type: actionTypes.SET_SAVINGS_COUNT, payload: savings });
        dispatch({ type: actionTypes.SET_TOTAL_SAVINGS, payload: total });
        dispatch({ type: actionTypes.SET_CHART_DATA, payload: chartData });
        dispatch({
          type: actionTypes.SET_CATEGORY_DATA,
          payload: categoryData,
        });
        dispatch({ type: actionTypes.SET_TYPE_DATA, payload: typeData });
      }
    };
    fetchData();
  }, [user, filter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        customSelectRef.current &&
        !customSelectRef.current.contains(e.target)
      ) {
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
      endOfPeriod = new Date(
        today.setDate(today.getDate() - today.getDay() + 6),
      );
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
      const weeksInMonth = Math.ceil(
        (endOfPeriod.getDate() - startOfPeriod.getDate() + 1) / 7,
      );
      for (let i = 1; i <= weeksInMonth; i++) {
        periodData[`Week ${i}`] = 0;
      }
    } else {
      const monthsOfYear = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
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

        if (
          statusDate < today &&
          statusDate >= startOfPeriod &&
          statusDate <= endOfPeriod
        ) {
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
    <div className="space-y-4 p-4 md:py-10">
      <TabNavigation
        isActiveTab={isActiveTab}
        setIsActiveTab={setIsActiveTab}
      />
      {isActiveTab === "overview" && (
        <OverviewSection
          completedCount={state.completedCount}
          savingsCount={state.savingsCount}
          totalSavings={state.totalSavings}
          filter={filter}
          setFilter={setFilter}
          options={options}
          chartData={state.chartData}
          habits={state.habits}
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
            savingsCount={state.savingsCount}
            categoryData={state.categoryData}
            customSelectRef={customSelectRef}
          />
          <TypeSection
            filter={filter}
            setFilter={setFilter}
            options={options}
            savingsCount={state.savingsCount}
            typeData={state.typeData}
            customSelectRef={customSelectRef}
          />
        </div>
      )}
    </div>
  );
}

export default Savings;
