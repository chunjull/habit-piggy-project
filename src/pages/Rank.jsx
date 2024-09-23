import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getAllUsers, getHabits, getSavings } from "../services/api";

const HabitAchievements = ["習以為常", "習蘭紅茶", "自強不習", "今非習比"];
const SavingsAchievements = ["金豬玉葉", "錙豬必較", "豬圓玉潤", "豬絲馬跡"];

const getCurrentCycleIndex = () => {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const currentWeekNumber = Math.ceil(((new Date() - startOfYear) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7);
  return (currentWeekNumber - 1) % HabitAchievements.length;
};

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
        setUserHabitCounts(userHabitCounts);
      } else if (isActiveTab === "savings") {
        const userSavingsCounts = await calculateUserSavingsCounts(startOfWeek, endOfWeek);
        setUserSavingsCounts(userSavingsCounts);
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
    const userSavingsCounts = await Promise.all(
      users.map(async (user) => {
        const savings = await getSavings(user.uid);
        const totalSavings = savings.reduce((total, saving) => {
          const savingDate = new Date(saving.date);
          return savingDate >= startOfWeek && savingDate <= endOfWeek ? total + saving.amount : total;
        }, 0);
        return { ...user, totalSavings };
      })
    );
    return userSavingsCounts;
  };

  const renderTopTenUsers = (userCounts, type) => {
    const sortedUsers = userCounts.sort((a, b) => (type === "habit" ? b.completedCount - a.completedCount : b.totalSavings - a.totalSavings));
    return sortedUsers.slice(0, 10).map((user, index) => (
      <li key={user.uid} className="flex justify-between py-2 px-4 bg-slate-100">
        <div className="flex items-center gap-3">
          <p className="w-10 h-auto">{index + 1}</p>
          <img src={user.avatar} alt="user's avatar" className="w-10 h-10" />
          <div>
            <p>{user.name}</p>
            <p>Lv. {user.levelPoints}</p>
          </div>
        </div>
        <div className="text-end">
          <p>{type === "habit" ? "累積數量" : "累積存款"}</p>
          <p>{type === "habit" ? `${user.completedCount} 次` : `${user.totalSavings} 元`}</p>
        </div>
      </li>
    ));
  };

  const renderCurrentUser = (userCounts, currentUser, type) => {
    const currentUserData = userCounts.find((user) => user.uid === currentUser.uid);
    if (!currentUserData) {
      return null;
    }
    const rank = userCounts.findIndex((user) => user.uid === currentUser.uid) + 1;
    return (
      <div className="flex justify-between py-2 px-4 bg-slate-900">
        <div className="flex items-center gap-3 text-white">
          <p className="w-10 h-auto">{rank}</p>
          <img src={currentUserData.avatar} alt="user's avatar" className="w-10 h-10" />
          <div>
            <p>{currentUserData.name}</p>
            <p>Lv. {currentUserData.levelPoints}</p>
          </div>
        </div>
        <div className="text-end text-white">
          <p>{type === "habit" ? "累積數量" : "累積存款"}</p>
          <p>{type === "habit" ? `${currentUserData.completedCount} 次` : `${currentUserData.totalSavings} 元`}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <ul className="grid grid-cols-2 w-full">
        <li className={`border p-2 text-center ${isActiveTab === "habit" ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab("habit")}>
          習慣排行
        </li>
        <li className={`border p-2 text-center ${isActiveTab === "savings" ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab("savings")}>
          存款排行
        </li>
        {/* <li className={`border p-2 text-center ${isActiveTab === "challenge" ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab("challenge")}>
          挑戰排行
        </li> */}
      </ul>
      {isActiveTab === "habit" && (
        <div>
          <div className="p-4 mt-4 bg-slate-300">
            <p className="text-center">
              在 {getStartAndEndOfWeek().startOfWeek.toLocaleDateString()}～{getStartAndEndOfWeek().endOfWeek.toLocaleDateString()} 期間
            </p>
            <p className="text-center">恭喜 {userHabitCounts[0]?.name || "No.1"} 成為累積最多次習慣的玩家</p>
            <p className="text-center">獲得{HabitAchievements[getCurrentCycleIndex()]}成就！</p>
          </div>
          <ul className="space-y-4">{renderTopTenUsers(userHabitCounts, "habit")}</ul>
          {renderCurrentUser(userHabitCounts, user, "habit")}
        </div>
      )}
      {isActiveTab === "savings" && (
        <div>
          <div className="p-4 mt-4 bg-slate-300">
            <p className="text-center">
              在 {getStartAndEndOfWeek().startOfWeek.toLocaleDateString()}～{getStartAndEndOfWeek().endOfWeek.toLocaleDateString()} 期間
            </p>
            <p className="text-center">恭喜 {userSavingsCounts[0]?.name || "No.1"} 成為累積最多存款的玩家</p>
            <p className="text-center">獲得{SavingsAchievements[getCurrentCycleIndex()]}成就！</p>
          </div>
          <ul className="space-y-4">{renderTopTenUsers(userSavingsCounts, "savings")}</ul>
          {renderCurrentUser(userSavingsCounts, user, "savings")}
        </div>
      )}
      {/* {isActiveTab === "challenge" && <div>挑戰排行</div>} */}
    </div>
  );
}

export default Rank;
