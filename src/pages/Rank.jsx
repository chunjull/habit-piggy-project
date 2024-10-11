import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getAllUsers, getHabits } from "../services/api";
import { rankIcons } from "../assets/icons";

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

  const renderTopTenUsers = (userCounts, type) => {
    const sortedUsers = [...userCounts].sort((a, b) => (type === "habit" ? b.completedCount - a.completedCount : b.totalSavings - a.totalSavings));

    return sortedUsers.slice(0, 10).map((user, index) => {
      const { level } = calculateLevelAndPoints(user.levelPoints);
      return (
        <li key={user.uid} className="relative flex justify-between items-center py-2 px-4 bg-black-50 dark:bg-black-800 rounded-2xl hover:bg-black-0 dark:hover:bg-black-600">
          <div className="flex items-center gap-3">
            {index < 3 ? (
              <div className="flex items-center gap-3">
                <div className="absolute top-[-4px]">
                  <div className="w-10 h-[68px] flex justify-center items-center bg-primary relative">
                    <p className="font-normal text-center text-3xl leading-9 font-lobster text-alert">{index + 1}</p>
                    <div className="absolute before:content-[''] before:absolute before:bottom-[-34px] before:right-0 before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-b-[12px] before:border-l-transparent before:border-r-transparent before:border-b-black-50 dark:before:border-b-black-800 before:z-20"></div>
                    <div className="absolute before:content-[''] before:absolute before:bottom-[-34px] before:left-0 before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-b-[12px] before:border-l-transparent before:border-r-transparent before:border-b-black-50 dark:before:border-b-black-800 before:z-20"></div>
                    <div className="absolute before:content-[''] before:absolute before:bottom-[30px] before:left-5 before:w-0 before:h-0 before:border-l-0 before:border-r-[3px] before:border-b-[4px] before:border-l-transparent before:border-r-transparent before:border-b-primary-dark before:z-20"></div>
                  </div>
                </div>
                <img src={user.avatar} alt="user's avatar" className="w-12 h-12 rounded-full ml-14 object-cover outline outline-primary-dark dark:outline-primary" />
                <div>
                  <p className="font-normal text-lg leading-7 text-black dark:text-black-0">{user.name}</p>
                  <p className="font-normal text-sm leading-5 text-black-700 dark:text-black-200">Lv.{level}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto font-normal text-center text-3xl leading-9 font-lobster text-black dark:text-black-0">{index + 1}</p>
                <img src={user.avatar} alt="user's avatar" className="w-12 h-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary" />
                <div>
                  <p className="font-normal text-lg leading-7 text-black dark:text-black-0">{user.name}</p>
                  <p className="font-normal text-sm leading-5 text-black-700 dark:text-black-200">Lv.{level}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <p className="font-normal text-sm leading-5 text-black dark:text-black-0">{type === "habit" ? "累積數量" : "累積存款"}</p>
            {type === "habit" ? (
              <div className="flex items-center gap-1">
                <p className="font-bold text-base leading-6 text-black dark:text-black-0">{user.completedCount}</p>
                <p className="font-normal text-sm leading-5 text-black dark:text-black-0">次</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <p className="font-bold text-base leading-6 text-black dark:text-black-0">{user.totalSavings}</p>
                <p className="font-normal text-sm leading-5 text-black dark:text-black-0">元</p>
              </div>
            )}
          </div>
        </li>
      );
    });
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
    <div className="p-4 md:py-10 space-y-4">
      <ul className="grid grid-cols-2 w-full pb-3">
        <li
          className={`border border-black-500 rounded-s-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "habit" ? "bg-primary" : "bg-black-50"}`}
          onClick={() => setIsActiveTab("habit")}
        >
          習慣排行
        </li>
        <li
          className={`border-e border-y border-black-500 rounded-e-full py-1 font-normal text-sm leading-5 text-center cursor-pointer ${isActiveTab === "savings" ? "bg-primary" : "bg-black-50"}`}
          onClick={() => setIsActiveTab("savings")}
        >
          存款排行
        </li>
      </ul>
      {isActiveTab === "habit" && (
        <div className="relative space-y-4">
          <div className="p-4 mt-4 bg-black-50 dark:bg-black-800 rounded-lg flex flex-col items-center">
            <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">
              在 {getStartAndEndOfWeek().startOfWeek.toLocaleDateString()}～{getStartAndEndOfWeek().endOfWeek.toLocaleDateString()} 期間
            </p>
            <div className="flex justify-center items-center gap-x-1 flex-wrap">
              <p className="font-normal text-base leading-6 text-black dark:text-black-0">恭喜</p>
              <p className="font-bold text-xl leading-7 text-black dark:text-black-0">{userHabitCounts[0]?.name || "No.1"}</p>
              <p className="font-normal text-base leading-6 text-black dark:text-black-0">成為累積最多次習慣的玩家</p>
            </div>
          </div>
          <div className="absolute -top-8 inset-x-0 text-primary flex items-center justify-center">
            <rankIcons.TbCircleCheck className="w-8 h-8" />
            <rankIcons.TbCircleCheckFilled className="w-8 h-8" />
            <rankIcons.TbCircleCheck className="w-8 h-8" />
          </div>
          <ul className="space-y-4 pb-20">{renderTopTenUsers(userHabitCounts, "habit")}</ul>
          <div className="fixed bottom-0 left-0 md:left-auto w-full max-w-full md:max-w-[1128px] mx-auto p-4 pb-[88px] bg-light dark:bg-black-950 md:p-0 md:py-4">
            {renderCurrentUser(userHabitCounts, user, "habit")}
          </div>
        </div>
      )}
      {isActiveTab === "savings" && (
        <div className="relative space-y-4">
          <div className="p-4 mt-4 bg-black-50 dark:bg-black-800 rounded-lg flex flex-col items-center">
            <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">
              在 {getStartAndEndOfWeek().startOfWeek.toLocaleDateString()}～{getStartAndEndOfWeek().endOfWeek.toLocaleDateString()} 期間
            </p>
            <div className="flex justify-center items-center gap-x-1 flex-wrap">
              <p className="font-normal text-base leading-6 text-black dark:text-black-0">恭喜</p>
              <p className="font-bold text-xl leading-7 text-black dark:text-black-0">{userSavingsCounts[0]?.name || "No.1"}</p>
              <p className="font-normal text-base leading-6 text-black dark:text-black-0">成為累積最多存款的玩家</p>
            </div>
          </div>
          <div className="absolute -top-8 inset-x-0 text-primary flex items-center justify-center">
            <rankIcons.TbCoin className="w-8 h-8" />
            <rankIcons.TbCoinFilled className="w-8 h-8" />
            <rankIcons.TbCoin className="w-8 h-8" />
          </div>
          <ul className="space-y-4 pb-20">{renderTopTenUsers(userSavingsCounts, "savings")}</ul>
          <div className="fixed bottom-0 left-0 md:left-auto w-full max-w-full md:max-w-[1128px] mx-auto p-4 pb-[88px] bg-light dark:bg-black-950 md:p-0 md:py-4">
            {renderCurrentUser(userSavingsCounts, user, "savings")}
          </div>
        </div>
      )}
    </div>
  );
}

export default Rank;
