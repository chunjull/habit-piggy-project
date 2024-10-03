import PropTypes from "prop-types";

const AchievementList = ({ sortedAchievements, userAchievements, handleAchievementModal }) => {
  return (
    <div className="pt-9 pb-4 px-4 bg-black-50 dark:bg-black-800 space-y-4 rounded-2xl relative">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {sortedAchievements.slice(0, 6).map((achievement) => {
          const isAchieved = userAchievements.includes(achievement.id);
          return (
            <li
              key={achievement.id}
              className={`py-1 w-full flex justify-center items-center rounded-lg border-2 cursor-default ${
                isAchieved ? "opacity-100 border-primary-dark bg-gradient-to-br from-primary via-primary-dark to-alert" : "opacity-50 border-black-500 bg-black-100"
              }`}
            >
              <p
                className={`font-normal text-base leading-6 md:text-xl md:leading-7 stroke-text ${isAchieved ? "text-primary z-0" : "text-black dark:text-black-0-500"}`}
                data-stroke={isAchieved ? achievement.name : ""}
              >
                {achievement.name}
              </p>
            </li>
          );
        })}
      </ul>
      <button className="text-center w-full bg-primary rounded-xl font-medium text-sm leading-5 py-1 hover:bg-primary-dark" onClick={handleAchievementModal}>
        更多成就
      </button>
      <div className="bg-primary py-1 px-4 w-fit absolute -top-12 left-1/2 transform -translate-x-1/2">
        <p className="font-lobster font-normal text-2xl leading-8 text-alert">Achievement</p>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[-16px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-t-[12px] before:border-l-primary before:border-r-transparent before:border-t-primary-dark before:z-20"></div>
        <div className="absolute before:content-[''] before:absolute before:bottom-[-16px] before:left-[114px] before:w-0 before:h-0 before:border-r-[20px] before:border-l-0 before:border-t-[12px] before:border-r-primary before:border-l-transparent before:border-t-primary-dark before:z-20"></div>
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

export default AchievementList;

AchievementList.propTypes = {
  sortedAchievements: PropTypes.array.isRequired,
  userAchievements: PropTypes.array.isRequired,
  handleAchievementModal: PropTypes.func.isRequired,
};
