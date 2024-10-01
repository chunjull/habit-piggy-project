import { modalIcons } from "../assets/icons";
import PropTypes from "prop-types";

const AchievementModal = ({ handleAchievementModal }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg leading-7">你的成就</h3>
        <modalIcons.TbX className="w-8 h-8 cursor-pointer hover:text-alert" onClick={handleAchievementModal} />
      </div>
    </div>
  );
};

AchievementModal.propTypes = {
  handleAchievementModal: PropTypes.func.isRequired,
};

export default AchievementModal;
