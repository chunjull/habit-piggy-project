import PropTypes from "prop-types";
import { modalIcons } from "../../assets/icons";

const AchievementModal = ({
  handleAchievementModal,
  userAchievements,
  sortedAchievements,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold leading-7 text-black dark:text-black-0">
          你的成就
        </h3>
        <modalIcons.TbX
          className="h-8 w-8 cursor-pointer text-black hover:text-alert dark:text-black-0"
          onClick={handleAchievementModal}
        />
      </div>
      <div className="max-h-56 overflow-scroll">
        <ul className="grid grid-cols-2 gap-4">
          {sortedAchievements.map((achievement) => {
            const isAchieved = userAchievements.includes(achievement.id);
            return (
              <li key={achievement.id}>
                <div
                  className={`flex w-full cursor-default items-center justify-center rounded-lg border-2 py-1 ${
                    isAchieved
                      ? "border-primary-dark bg-light opacity-100"
                      : "border-black-500 bg-black-100 text-black opacity-50 dark:border-black-300"
                  }`}
                >
                  <p
                    className={`stroke-text text-base font-normal leading-6 md:text-xl md:leading-7 ${isAchieved ? "z-0 text-primary" : "text-black"}`}
                    data-stroke={isAchieved ? achievement.name : ""}
                  >
                    {achievement.name}
                  </p>
                </div>
                <p className="mt-1 text-center text-xs font-normal leading-4 text-black dark:text-black-0 md:text-sm md:leading-5">
                  {achievement.description}
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
  achievements: PropTypes.array,
  userAchievements: PropTypes.array.isRequired,
  sortedAchievements: PropTypes.array.isRequired,
};

export default AchievementModal;
