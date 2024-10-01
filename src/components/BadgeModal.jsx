import { modalIcons } from "../assets/icons";
import PropTypes from "prop-types";

const BadgeModal = ({ handleBadgeModal, sortedBadges, userBadges }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg leading-7">你的獎勵徽章</h3>
        <modalIcons.TbX className="w-8 h-8 cursor-pointer hover:text-alert" onClick={handleBadgeModal} />
      </div>
      <div className="max-h-56 overflow-scroll">
        <ul className="grid grid-cols-3 gap-4">
          {sortedBadges.map((badge, index) => (
            <li key={badge.id} className="relative w-full h-fit">
              <img src={badge.image} alt={`Badge ${index}`} className={`w-full h-full object-cover ${userBadges.includes(badge.id) ? "opacity-100" : "opacity-30"}`} />
              <div className="mt-1 text-black-700 text-center font-normal text-xs leading-4 md:text-sm md:leading-5">{badge.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

BadgeModal.propTypes = {
  handleBadgeModal: PropTypes.func.isRequired,
  sortedBadges: PropTypes.array.isRequired,
  userBadges: PropTypes.array.isRequired,
};

export default BadgeModal;
