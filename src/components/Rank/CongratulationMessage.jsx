import PropTypes from "prop-types";

const CongratulationMessage = ({ userCounts, type }) => (
  <div className="flex flex-wrap items-center justify-center gap-x-1">
    <p className="text-center text-base font-normal leading-6 text-black dark:text-black-0">
      恭喜
    </p>
    <p className="text-xl font-bold leading-7 text-black dark:text-black-0">
      {userCounts[0]?.name || "No.1"}
    </p>
    <p className="text-base font-normal leading-6 text-black dark:text-black-0">
      成為累積最多{type === "habit" ? "次習慣" : "存款"}的玩家
    </p>
  </div>
);

export default CongratulationMessage;

CongratulationMessage.propTypes = {
  userCounts: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};
