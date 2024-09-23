import { useContext } from "react";
import { AchievementContext } from "../utils/AchievementsContext";

export const useAchievements = () => useContext(AchievementContext);
