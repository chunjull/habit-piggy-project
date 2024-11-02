import PropTypes from "prop-types";

const BadgeList = ({
  sortedBadges,
  userBadges,
  handleBadgeModal,
  isLoading,
}) => {
  return (
    <div className="relative space-y-4 rounded-2xl bg-black-50 px-4 pb-4 pt-9 dark:bg-black-800">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-6 gap-4">
            <div className="mx-auto aspect-square h-fit w-1/2 rounded-full bg-black-200" />
            <div className="mx-auto aspect-square h-fit w-1/2 rounded-full bg-black-200" />
            <div className="mx-auto aspect-square h-fit w-1/2 rounded-full bg-black-200" />
            <div className="mx-auto aspect-square h-fit w-1/2 rounded-full bg-black-200" />
            <div className="mx-auto aspect-square h-fit w-1/2 rounded-full bg-black-200" />
            <div className="mx-auto aspect-square h-fit w-1/2 rounded-full bg-black-200" />
          </div>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {sortedBadges.slice(0, 6).map((badge, index) => (
              <li key={badge.id} className="relative h-fit w-full">
                <img
                  src={badge.image}
                  alt={`Badge ${index}`}
                  className={`h-full w-full object-cover ${userBadges.includes(badge.id) ? "opacity-100" : "opacity-30"}`}
                />
              </li>
            ))}
          </ul>
          <button
            className="w-full rounded-xl bg-primary py-1 text-center text-sm font-medium leading-5 hover:bg-primary-dark"
            onClick={handleBadgeModal}
          >
            更多獎勵徽章
          </button>
        </>
      )}
      <div className="absolute -top-12 left-1/2 w-[150px] -translate-x-1/2 transform bg-primary px-4 py-1">
        <p className="text-center font-lobster text-2xl font-normal leading-8 text-alert">
          Badge
        </p>
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[-16px] before:z-20 before:h-0 before:w-0 before:border-l-[20px] before:border-r-0 before:border-t-[13px] before:border-l-primary before:border-r-transparent before:border-t-primary-dark before:content-['']" />
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[114px] before:z-20 before:h-0 before:w-0 before:border-l-0 before:border-r-[20px] before:border-t-[13px] before:border-l-transparent before:border-r-primary before:border-t-primary-dark before:content-['']" />
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[-46px] before:h-10 before:w-8 before:bg-primary before:content-['']" />
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[134px] before:h-10 before:w-8 before:bg-primary before:content-['']" />
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[166px] before:z-20 before:h-0 before:w-0 before:border-b-[20px] before:border-l-0 before:border-r-[20px] before:border-b-primary before:border-l-transparent before:border-r-transparent before:content-['']" />
        <div className="absolute before:absolute before:bottom-1 before:left-[166px] before:z-20 before:h-0 before:w-0 before:border-l-0 before:border-r-[20px] before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:content-['']" />
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[-66px] before:z-20 before:h-0 before:w-0 before:border-b-[20px] before:border-l-[20px] before:border-r-0 before:border-b-primary before:border-l-transparent before:border-r-transparent before:content-['']" />
        <div className="absolute before:absolute before:bottom-1 before:left-[-66px] before:z-20 before:h-0 before:w-0 before:border-l-[20px] before:border-r-0 before:border-t-[20px] before:border-l-transparent before:border-r-transparent before:border-t-primary before:content-['']" />
      </div>
    </div>
  );
};

export default BadgeList;

BadgeList.propTypes = {
  sortedBadges: PropTypes.array.isRequired,
  userBadges: PropTypes.array.isRequired,
  handleBadgeModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
