import { modalIcons } from "../assets/icons";
import PropTypes from "prop-types";

const BadgeModal = ({ handleBadgeModal, badges, userAchievements }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg leading-7">你的獎勵徽章</h3>
        <modalIcons.TbX className="w-8 h-8 cursor-pointer hover:text-alert" onClick={handleBadgeModal} />
      </div>
      <ul className="grid grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <li key={index} className="w-full h-fit">
            <img src={badge} alt={`Badge ${index}`} className={`w-full h-full object-cover ${userAchievements.includes(badge.id) ? "opacity-100" : "opacity-30"}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

BadgeModal.propTypes = {
  handleBadgeModal: PropTypes.func.isRequired,
  badges: PropTypes.array.isRequired,
  userAchievements: PropTypes.array.isRequired,
};

export default BadgeModal;
