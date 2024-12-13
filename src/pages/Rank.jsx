import { useContext, useEffect, useReducer, useState } from "react";
import CongratulationMessage from "../components/Rank/CongratulationMessage";
import CongratulationMessageIcons from "../components/Rank/CongratulationMessageIcons";
import CurrentUser from "../components/Rank/CurrentUser";
import DateRange from "../components/Rank/DateRange";
import TopTenUsersList from "../components/Rank/TopTenUserList";
import TabNavigation from "../components/TabNavigation";
import { getAllUsers, getHabits } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import { actionTypes, initialState, reducer } from "../utils/HabitReducer";

function Rank() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isActiveTab, setIsActiveTab] = useState("habit");
  const [userHabitCounts, setUserHabitCounts] = useState([]);
  const [userSavingsCounts, setUserSavingsCounts] = useState([]);
  const { user } = useContext(AuthContext);

  const tabs = [
    { key: "habit", label: "習慣排行" },
    { key: "savings", label: "存款排行" },
  ];

  useEffect(() => {
    dispatch({ type: actionTypes.SET_IS_LOADING, payload: true });
    const fetchData = async () => {
      const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
      if (isActiveTab === "habit") {
        const userHabitCounts = await calculateUserHabitCounts(
          startOfWeek,
          endOfWeek,
        );
        const sortedUserHabitCounts = [...userHabitCounts].sort(
          (a, b) => b.completedCount - a.completedCount,
        );
        setUserHabitCounts(sortedUserHabitCounts);
      } else if (isActiveTab === "savings") {
        const userSavingsCounts = await calculateUserSavingsCounts(
          startOfWeek,
          endOfWeek,
        );
        const sortedUserSavingsCounts = [...userSavingsCounts].sort(
          (a, b) => b.totalSavings - a.totalSavings,
        );
        setUserSavingsCounts(sortedUserSavingsCounts);
      }
    };
    fetchData();
    dispatch({ type: actionTypes.SET_IS_LOADING, payload: false });
  }, [isActiveTab]);

  const getStartAndEndOfWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay()),
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6),
    );
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  };

  const calculateUserHabitCounts = async (startOfWeek, endOfWeek) => {
    const users = await getAllUsers();
    const userHabitCounts = await Promise.all(
      users.map(async (user) => {
        const habits = await getHabits(user.uid);
        const completedCount = habits.reduce((count, habit) => {
          return (
            count +
            habit.status.filter((status) => {
              const statusDate = new Date(status.date);
              return (
                status.completed &&
                statusDate >= startOfWeek &&
                statusDate <= endOfWeek
              );
            }).length
          );
        }, 0);
        return { ...user, completedCount };
      }),
    );
    return userHabitCounts;
  };

  const calculateUserSavingsCounts = async (startOfWeek, endOfWeek) => {
    const users = await getAllUsers();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userSavingsCounts = await Promise.all(
      users.map(async (user) => {
        const habits = await getHabits(user.uid);
        const totalSavings = habits.reduce((total, habit) => {
          const penaltyAmount = habit.amount;
          const incompleteCount = habit.status.filter((status) => {
            const statusDate = new Date(status.date);
            return (
              !status.completed &&
              statusDate >= startOfWeek &&
              statusDate <= endOfWeek &&
              statusDate < today
            );
          }).length;
          return total + incompleteCount * penaltyAmount;
        }, 0);
        return { ...user, totalSavings };
      }),
    );
    return userSavingsCounts;
  };

  const calculateLevelAndPoints = (levelPoints) => {
    let level = Math.floor(levelPoints / 100);
    if (level > 99) {
      level = 99;
    }
    return { level };
  };

  return (
    <div className="mb:pb-6 space-y-4 p-4 md:pt-10">
      <TabNavigation
        tabs={tabs}
        isActiveTab={isActiveTab}
        setIsActiveTab={setIsActiveTab}
      />
      {isActiveTab === "habit" && (
        <div className="relative space-y-4">
          <div className="mt-4 flex flex-col items-center rounded-lg bg-black-50 p-4 dark:bg-black-800">
            <DateRange getStartAndEndOfWeek={getStartAndEndOfWeek} />
            <CongratulationMessage userCounts={userHabitCounts} type="habit" />
          </div>
          <CongratulationMessageIcons type="habits" />
          <TopTenUsersList
            userCounts={userHabitCounts}
            calculateLevelAndPoints={calculateLevelAndPoints}
            isLoading={state.isLoading}
            type="habit"
          />
          <div className="sticky bottom-0 left-0 mb-[88px] w-full bg-light pb-[88px] dark:bg-black-950 md:pb-4">
            <CurrentUser
              userCounts={userHabitCounts}
              currentUser={user}
              calculateLevelAndPoints={calculateLevelAndPoints}
              type="habit"
            />
          </div>
        </div>
      )}
      {isActiveTab === "savings" && (
        <div className="relative space-y-4">
          <div className="mt-4 flex flex-col items-center rounded-lg bg-black-50 p-4 dark:bg-black-800">
            <DateRange getStartAndEndOfWeek={getStartAndEndOfWeek} />
            <CongratulationMessage
              userCounts={userHabitCounts}
              type="savings"
            />
          </div>
          <CongratulationMessageIcons type="savings" />
          <TopTenUsersList
            userCounts={userSavingsCounts}
            calculateLevelAndPoints={calculateLevelAndPoints}
            type="savings"
          />
          <div className="sticky bottom-0 left-0 mb-[88px] w-full bg-light dark:bg-black-950 md:pb-4">
            <CurrentUser
              userCounts={userSavingsCounts}
              currentUser={user}
              calculateLevelAndPoints={calculateLevelAndPoints}
              type="savings"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Rank;
