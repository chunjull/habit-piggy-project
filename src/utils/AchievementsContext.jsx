import { createContext, useContext, useEffect, useState } from "react";
import { getAchievements, getUserAchievements, addUserAchievement } from "../services/api";
import { AuthContext } from "../utils/AuthContext";
import PropTypes from "prop-types";

const AchievementContext = createContext();

export const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadAchievements = async () => {
      const achievementsData = await getAchievements();
      setAchievements(achievementsData);
    };

    loadAchievements();
  }, []);

  const checkAchievements = async (type, count) => {
    if (!user) return;

    const userAchievements = await getUserAchievements(user.uid);

    achievements.forEach(async (achievement) => {
      if (achievement.condition.type === type && count >= achievement.condition.count && !userAchievements.some((a) => a.id === achievement.id)) {
        await addUserAchievement(user.uid, {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          getTime: new Date().getTime(),
        });
      }
    });
  };

  return <AchievementContext.Provider value={{ achievements, checkAchievements }}>{children}</AchievementContext.Provider>;
};

AchievementProvider.propTypes = {
  children: PropTypes.node,
};

export { AchievementContext };
