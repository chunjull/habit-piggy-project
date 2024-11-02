import PropTypes from "prop-types";

const AchievementList = ({
  sortedAchievements,
  userAchievements,
  handleAchievementModal,
  isLoading,
}) => {
  return (
    <div className="relative space-y-4 rounded-2xl bg-black-50 px-4 pb-4 pt-9 dark:bg-black-800">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-8 w-full rounded-lg bg-black-200" />
            <div className="h-8 w-full rounded-lg bg-black-200" />
            <div className="h-8 w-full rounded-lg bg-black-200" />
            <div className="h-8 w-full rounded-lg bg-black-200" />
            <div className="h-8 w-full rounded-lg bg-black-200" />
            <div className="h-8 w-full rounded-lg bg-black-200" />
          </div>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {sortedAchievements.slice(0, 6).map((achievement) => {
              const isAchieved = userAchievements.includes(achievement.id);
              return (
                <li
                  key={achievement.id}
                  className={`flex w-full cursor-default items-center justify-center rounded-lg border-2 py-1 ${
                    isAchieved
                      ? "border-primary-dark bg-light opacity-100"
                      : "border-black-500 bg-black-100 opacity-50 dark:border-black-300"
                  }`}
                >
                  <p
                    className={`stroke-text text-base font-normal leading-6 md:text-xl md:leading-7 ${isAchieved ? "z-0 text-primary" : "text-black"}`}
                    data-stroke={isAchieved ? achievement.name : ""}
                  >
                    {achievement.name}
                  </p>
                </li>
              );
            })}
          </ul>
          <button
            className="w-full rounded-xl bg-primary py-1 text-center text-sm font-medium leading-5 hover:bg-primary-dark"
            onClick={handleAchievementModal}
          >
            更多成就
          </button>
        </>
      )}
      <div className="absolute -top-12 left-1/2 w-fit -translate-x-1/2 transform bg-primary px-4 py-1">
        <p className="font-lobster text-2xl font-normal leading-8 text-alert">
          Achievement
        </p>
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[-16px] before:z-20 before:h-0 before:w-0 before:border-l-[20px] before:border-r-0 before:border-t-[12px] before:border-l-primary before:border-r-transparent before:border-t-primary-dark before:content-['']" />
        <div className="absolute before:absolute before:bottom-[-16px] before:left-[114px] before:z-20 before:h-0 before:w-0 before:border-l-0 before:border-r-[20px] before:border-t-[12px] before:border-l-transparent before:border-r-primary before:border-t-primary-dark before:content-['']" />
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

export default AchievementList;

AchievementList.propTypes = {
  sortedAchievements: PropTypes.array.isRequired,
  userAchievements: PropTypes.array.isRequired,
  handleAchievementModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
