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
          {sortedAchievements.map((achievement) => (
            <li key={achievement.id}>
              <div
                className={`py-1 w-full flex justify-center items-center rounded-lg border-2 cursor-default ${
                  userAchievements.includes(achievement.id)
                    ? "opacity-100 border-primary-dark bg-light text-primary-dark bordered-achievement"
                    : "opacity-50 border-black-500 bg-black-100 text-black-500"
                }`}
              >
                <div className="font-normal text-base leading-6">{achievement.name}</div>
              </div>
              <div className="mt-1 text-black-700 text-center font-normal text-xs leading-4 md:text-sm md:leading-5">{achievement.description}</div>
            </li>
          ))}
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
