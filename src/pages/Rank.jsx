import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getAllUsers, getHabits } from "../services/api";
import { rankIcons } from "../assets/icons";
import TabNavigation from "../components/Rank/TabNavigation";
import DateRange from "../components/Rank/DateRange";
import CongratulationMessage from "../components/Rank/CongratulationMessage";
import TopTenUsersList from "../components/Rank/TopTenUserList";

function Rank() {
  const [isActiveTab, setIsActiveTab] = useState("habit");
  const [userHabitCounts, setUserHabitCounts] = useState([]);
  const [userSavingsCounts, setUserSavingsCounts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
      if (isActiveTab === "habit") {
        const userHabitCounts = await calculateUserHabitCounts(startOfWeek, endOfWeek);
        const sortedUserHabitCounts = [...userHabitCounts].sort((a, b) => b.completedCount - a.completedCount);
        setUserHabitCounts(sortedUserHabitCounts);
      } else if (isActiveTab === "savings") {
        const userSavingsCounts = await calculateUserSavingsCounts(startOfWeek, endOfWeek);
        const sortedUserSavingsCounts = [...userSavingsCounts].sort((a, b) => b.totalSavings - a.totalSavings);
        setUserSavingsCounts(sortedUserSavingsCounts);
      }
    };
    fetchData();
  }, [isActiveTab]);

  const getStartAndEndOfWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
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
              return status.completed && statusDate >= startOfWeek && statusDate <= endOfWeek;
            }).length
          );
        }, 0);
        return { ...user, completedCount };
      })
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
            return !status.completed && statusDate >= startOfWeek && statusDate <= endOfWeek && statusDate < today;
          }).length;
          return total + incompleteCount * penaltyAmount;
        }, 0);
        return { ...user, totalSavings };
      })
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

  const renderCurrentUser = (userCounts, currentUser, type) => {
    const currentUserData = userCounts.find((user) => user.uid === currentUser.uid);
    if (!currentUserData) {
      return null;
    }
    const rank = userCounts.findIndex((user) => user.uid === currentUser.uid) + 1;
    const { level } = calculateLevelAndPoints(currentUserData.levelPoints);
    return (
      <div className="flex justify-between py-2 px-4 bg-black-500 dark:bg-black-50 rounded-2xl">
        <div className="flex items-center gap-3 text-black-0 dark:text-black">
          <p className="w-10 h-auto font-normal text-center text-3xl leading-9 font-lobster text-black-0 dark:text-black">{rank}</p>
          <img src={currentUserData.avatar} alt="user's avatar" className="w-12 h-12 rounded-full object-cover outline dark:outline-primary-dark outline-primary" />
          <div>
            <p className="font-normal text-lg leading-7 text-white dark:text-black">{currentUserData.name}</p>
            <p className="font-normal text-sm leading-5 text-black-200 dark:text-black-700">Lv.{level}</p>
          </div>
        </div>
        <div className="flex flex-col items-end text-black-0 dark:text-black">
          <p className="font-normal text-sm leading-5">{type === "habit" ? "累積數量" : "累積存款"}</p>
          {type === "habit" ? (
            <div className="flex items-center gap-1">
              <p className="font-bold text-base leading-6 text-black-0 dark:text-black">{currentUserData.completedCount}</p>
              <p className="font-normal text-sm leading-5 text-black-0 dark:text-black">次</p>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p className="font-bold text-base leading-6 text-black-0 dark:text-black">{currentUserData.totalSavings}</p>
              <p className="font-normal text-sm leading-5 text-black-0 dark:text-black">元</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:pt-10 mb:pb-6 space-y-4">
      <TabNavigation isActiveTab={isActiveTab} setIsActiveTab={setIsActiveTab} />
      {isActiveTab === "habit" && (
        <div className="relative space-y-4">
          <div className="p-4 mt-4 bg-black-50 dark:bg-black-800 rounded-lg flex flex-col items-center">
            <DateRange getStartAndEndOfWeek={getStartAndEndOfWeek} />
            <CongratulationMessage userCounts={userHabitCounts} type="habit" />
          </div>
          <div className="absolute -top-8 inset-x-0 text-primary flex items-center justify-center">
            <rankIcons.TbCircleCheck className="w-8 h-8" />
            <rankIcons.TbCircleCheckFilled className="w-8 h-8" />
            <rankIcons.TbCircleCheck className="w-8 h-8" />
          </div>
          <TopTenUsersList userCounts={userHabitCounts} calculateLevelAndPoints={calculateLevelAndPoints} type="habit" />
          <div className="sticky bottom-0 left-0 w-full pb-[88px] mb-[88px] md:pb-4 bg-light dark:bg-black-950">{renderCurrentUser(userHabitCounts, user, "habit")}</div>
        </div>
      )}
      {isActiveTab === "savings" && (
        <div className="relative space-y-4">
          <div className="p-4 mt-4 bg-black-50 dark:bg-black-800 rounded-lg flex flex-col items-center">
            <DateRange getStartAndEndOfWeek={getStartAndEndOfWeek} />
            <CongratulationMessage userCounts={userHabitCounts} type="savings" />
          </div>
          <div className="absolute -top-8 inset-x-0 text-primary flex items-center justify-center">
            <rankIcons.TbCoin className="w-8 h-8" />
            <rankIcons.TbCoinFilled className="w-8 h-8" />
            <rankIcons.TbCoin className="w-8 h-8" />
          </div>
          <TopTenUsersList userCounts={userSavingsCounts} calculateLevelAndPoints={calculateLevelAndPoints} type="savings" />
          <div className="sticky bottom-0 left-0 w-full mb-[88px] md:pb-4 bg-light dark:bg-black-950">{renderCurrentUser(userSavingsCounts, user, "savings")}</div>
        </div>
      )}
    </div>
  );
}

export default Rank;
