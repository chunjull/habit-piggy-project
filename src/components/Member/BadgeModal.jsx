import PropTypes from "prop-types";
import { modalIcons } from "../../assets/icons";

const BadgeModal = ({ handleBadgeModal, sortedBadges, userBadges }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold leading-7 text-black dark:text-black-0">
          你的獎勵徽章
        </h3>
        <modalIcons.TbX
          className="h-8 w-8 cursor-pointer text-black hover:text-alert dark:text-black-0"
          onClick={handleBadgeModal}
        />
      </div>
      <div className="max-h-56 overflow-scroll">
        <ul className="grid grid-cols-3 gap-4">
          {sortedBadges.map((badge, index) => (
            <li key={badge.id} className="relative h-fit w-full">
              <img
                src={badge.image}
                alt={`Badge ${index}`}
                className={`h-full w-full object-cover ${userBadges.includes(badge.id) ? "opacity-100" : "opacity-30"}`}
              />
              <div className="mt-1 text-center text-xs font-normal leading-4 text-black dark:text-black-0 md:text-sm md:leading-5">
                {badge.description}
              </div>
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
