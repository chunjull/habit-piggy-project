import { useContext, useEffect, useState } from "react";
import { getAchievements, getUserAchievements, addUserAchievement } from "../services/api";
import { AuthContext } from "../utils/AuthContext";

export const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadAchievements = async () => {
      const achievementsData = await getAchievements();
      setAchievements(achievementsData);
    };

    loadAchievements();
  }, []);

  const checkAchievements = async (type, value) => {
    if (!user) return;

    const userAchievements = await getUserAchievements(user.uid);

    achievements.forEach(async (achievement) => {
      const condition = achievement.condition;
      if (condition.type === type) {
        let isAchieved = false;
        if (type === "habit" && value >= condition.count) {
          isAchieved = true;
        } else if (type === "savings" && value >= condition.amount) {
          isAchieved = true;
        } else if (type === "streak" && value >= condition.percent) {
          isAchieved = true;
        }

        if (isAchieved && !userAchievements.some((a) => a.id === achievement.id)) {
          await addUserAchievement(user.uid, {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
          });
        }
      }
    });
  };

  return { achievements, checkAchievements };
};
