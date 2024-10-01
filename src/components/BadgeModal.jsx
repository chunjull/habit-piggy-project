import { modalIcons } from "../assets/icons";
import PropTypes from "prop-types";

const BadgeModal = ({ handleBadgeModal }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg leading-7">你的獎勵徽章</h3>
        <modalIcons.TbX className="w-8 h-8 cursor-pointer hover:text-alert" onClick={handleBadgeModal} />
      </div>
    </div>
  );
};

BadgeModal.propTypes = {
  handleBadgeModal: PropTypes.func.isRequired,
};

export default BadgeModal;
