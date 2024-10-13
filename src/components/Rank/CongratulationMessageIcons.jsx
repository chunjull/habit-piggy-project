import { rankIcons } from "../assets/icons";
import PropTypes from "prop-types";

const CoinIcons = ({ type }) => (
  <div className="absolute -top-8 inset-x-0 text-primary flex items-center justify-center">
    {type === "habits" ? (
      <>
        <rankIcons.TbCircleCheck className="w-8 h-8" />
        <rankIcons.TbCircleCheckFilled className="w-8 h-8" />
        <rankIcons.TbCircleCheck className="w-8 h-8" />
      </>
    ) : (
      <>
        <rankIcons.TbCoin className="w-8 h-8" />
        <rankIcons.TbCoinFilled className="w-8 h-8" />
        <rankIcons.TbCoin className="w-8 h-8" />
      </>
    )}
  </div>
);

export default CoinIcons;

CoinIcons.propTypes = {
  type: PropTypes.string.isRequired,
};
