import PropTypes from "prop-types";
import { rankIcons } from "../../assets/icons";

const RankIcons = ({ type }) => (
  <div className="absolute inset-x-0 -top-8 flex items-center justify-center text-primary">
    {type === "habits" ? (
      <>
        <rankIcons.TbCircleCheck className="h-8 w-8" />
        <rankIcons.TbCircleCheckFilled className="h-8 w-8" />
        <rankIcons.TbCircleCheck className="h-8 w-8" />
      </>
    ) : (
      <>
        <rankIcons.TbCoin className="h-8 w-8" />
        <rankIcons.TbCoinFilled className="h-8 w-8" />
        <rankIcons.TbCoin className="h-8 w-8" />
      </>
    )}
  </div>
);

export default RankIcons;

RankIcons.propTypes = {
  type: PropTypes.string.isRequired,
};
