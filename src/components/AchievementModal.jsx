import { modalIcons } from "../assets/icons";
import PropTypes from "prop-types";

const AchievementModal = ({ handleAchievementModal, userAchievements, sortedAchievements }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg leading-7">你的成就</h3>
        <modalIcons.TbX className="w-8 h-8 cursor-pointer hover:text-alert" onClick={handleAchievementModal} />
      </div>
      <div className="max-h-56 overflow-scroll">
        <ul className="grid grid-cols-2 gap-4">
          {sortedAchievements.slice(0, 6).map((achievement) => {
            const isAchieved = userAchievements.includes(achievement.id);
            return (
              <li
                key={achievement.id}
                className={`py-1 w-full flex justify-center items-center rounded-lg border-2 cursor-default ${
                  isAchieved ? "opacity-100 border-primary-dark bg-gradient-to-br from-primary via-primary-dark to-alert" : "opacity-50 border-black-500 bg-black-100"
                }`}
              >
                <p
                  className={`font-normal text-base leading-6 md:text-xl md:leading-7 stroke-text ${isAchieved ? "text-primary z-0" : "text-black-500"}`}
                  data-stroke={isAchieved ? achievement.name : ""}
                >
                  {achievement.name}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

AchievementModal.propTypes = {
  handleAchievementModal: PropTypes.func.isRequired,
  achievements: PropTypes.array.isRequired,
  userAchievements: PropTypes.array.isRequired,
  sortedAchievements: PropTypes.array.isRequired,
};

export default AchievementModal;
