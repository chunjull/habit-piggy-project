import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getAllUsers, getHabits } from "../services/api";

function Rank() {
  const [isActiveTab, setIsActiveTab] = useState("habit");
  const [userHabitCounts, setUserHabitCounts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
      const userHabitCounts = await calculateUserHabitCounts(startOfWeek, endOfWeek);
      setUserHabitCounts(userHabitCounts);
    };
    fetchData();
  }, []);

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

  const renderTopTenUsers = (userHabitCounts) => {
    const sortedUsers = userHabitCounts.sort((a, b) => b.completedCount - a.completedCount);
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
          <p>累積數量</p>
          <p>{user.completedCount} 次</p>
        </div>
      </li>
    ));
  };

  const renderCurrentUser = (userHabitCounts, currentUser) => {
    const currentUserData = userHabitCounts.find((user) => user.uid === currentUser.uid);
    if (!currentUserData) {
      return null;
    }
    const rank = userHabitCounts.findIndex((user) => user.uid === currentUser.uid) + 1;
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
          <p>累積數量</p>
          <p>{currentUserData.completedCount} 次</p>
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
              在 {getStartAndEndOfWeek().startOfWeek.toLocaleDateString()} ～ {getStartAndEndOfWeek().endOfWeek.toLocaleDateString()} 期間
              <br />
              恭喜 {userHabitCounts[0]?.name || "No.1"} 成為累積最多次習慣的玩家
              <br />
              獲得習以為常成就！
            </p>
          </div>
          <ul className="space-y-4">{renderTopTenUsers(userHabitCounts)}</ul>
          {renderCurrentUser(userHabitCounts, user)}
        </div>
      )}
      {isActiveTab === "savings" && <div>存款排行</div>}
      {/* {isActiveTab === "challenge" && <div>挑戰排行</div>} */}
    </div>
  );
}

export default Rank;
