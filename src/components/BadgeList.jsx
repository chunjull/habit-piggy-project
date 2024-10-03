import PropTypes from "prop-types";

const BadgeList = ({ sortedBadges, userBadges, handleBadgeModal }) => {
  return (
    <div className="pt-9 pb-4 px-4 bg-black-50 dark:bg-black-800 space-y-4 rounded-2xl relative">
      <ul className="grid grid-cols-3 gap-4 md:grid-cols-6">
        {sortedBadges.slice(0, 6).map((badge, index) => (
          <li key={badge.id} className="relative w-full h-fit">
            <img src={badge.image} alt={`Badge ${index}`} className={`w-full h-full object-cover ${userBadges.includes(badge.id) ? "opacity-100" : "opacity-30"}`} />
          </li>
        ))}
      </ul>
      <button className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark" onClick={handleBadgeModal}>
        更多獎勵徽章
      </button>
      <div className="bg-primary py-1 px-4 w-[150px] absolute -top-12 left-1/2 transform -translate-x-1/2">
        <p className="font-lobster font-normal text-2xl leading-8 text-alert text-center">Badge</p>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-16px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[13px] before:border-l-primary before:border-r-transparent before:border-t-primary-dark before:z-20"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[114px] before:w-0 before:h-0 before:border-r-[20px] before:border-l-0 before:border-t-[13px] before:border-r-primary before:border-l-transparent before:border-t-primary-dark before:z-20"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-46px] before:w-8 before:h-10 before:bg-primary"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[134px] before:w-8 before:h-10 before:bg-primary"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[166px] before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-b-[20px] before:border-l-transparent before:border-r-transparent before:border-b-primary before:z-20"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-1 before:left-[166px] before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:z-20"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-66px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-b-[20px] before:border-l-transparent before:border-r-transparent before:border-b-primary before:z-20"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-1 before:left-[-66px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:z-20"></div>
      </div>
    </div>
  );
};

export default BadgeList;

BadgeList.propTypes = {
  sortedBadges: PropTypes.array.isRequired,
  userBadges: PropTypes.array.isRequired,
  handleBadgeModal: PropTypes.func.isRequired,
};
