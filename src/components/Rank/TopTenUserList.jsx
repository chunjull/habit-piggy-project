import PropTypes from "prop-types";

const TopTenUsersList = ({ userCounts, type, calculateLevelAndPoints }) => {
  const sortedUsers = [...userCounts].sort((a, b) => (type === "habit" ? b.completedCount - a.completedCount : b.totalSavings - a.totalSavings));

  return (
    <ul className="space-y-4">
      {sortedUsers.slice(0, 10).map((user, index) => {
        const { level } = calculateLevelAndPoints(user.levelPoints);
        return (
          <li key={user.uid} className="relative flex justify-between items-center py-2 px-4 bg-black-50 dark:bg-black-800 rounded-2xl hover:bg-black-0 dark:hover:bg-black-600">
            {/* User Info */}
            <div className="flex items-center gap-3">
              {index < 3 ? (
                <div className="flex items-center gap-3">
                  <div className="absolute top-[-4px]">
                    <div className="w-10 h-[68px] flex justify-center items-center bg-primary relative">
                      <p className="font-normal text-center text-3xl leading-9 font-lobster text-alert">{index + 1}</p>
                      <div className="absolute before:content-[''] before:absolute before:bottom-[-34px] before:right-0 before:w-0 before:h-0 before:border-l-[20px] before:border-r-0 before:border-b-[12px] before:border-l-transparent before:border-r-transparent before:border-b-black-50 dark:before:border-b-black-800 before:z-20"></div>
                      <div className="absolute before:content-[''] before:absolute before:bottom-[-34px] before:left-0 before:w-0 before:h-0 before:border-l-0 before:border-r-[20px] before:border-b-[12px] before:border-l-transparent before:border-r-transparent before:border-b-black-50 dark:before:border-b-black-800 before:z-20"></div>
                      <div className="absolute before:content-[''] before:absolute before:bottom-[30px] before:left-5 before:w-0 before:h-0 before:border-l-0 before:border-r-[3px] before:border-b-[4px] before:border-l-transparent before:border-r-transparent before:border-b-primary-dark before:z-20"></div>
                    </div>
                  </div>
                  <img src={user.avatar} alt="user's avatar" className="w-12 h-12 rounded-full ml-14 object-cover outline outline-primary-dark dark:outline-primary" />
                  <div>
                    <p className="font-normal text-lg leading-7 text-black dark:text-black-0">{user.name}</p>
                    <p className="font-normal text-sm leading-5 text-black-700 dark:text-black-200">Lv.{level}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="w-10 h-auto font-normal text-center text-3xl leading-9 font-lobster text-black dark:text-black-0">{index + 1}</p>
                  <img src={user.avatar} alt="user's avatar" className="w-12 h-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary" />
                  <div>
                    <p className="font-normal text-lg leading-7 text-black dark:text-black-0">{user.name}</p>
                    <p className="font-normal text-sm leading-5 text-black-700 dark:text-black-200">Lv.{level}</p>
                  </div>
                </div>
              )}
            </div>
            {/* User Stats */}
            <div className="flex flex-col items-end">
              <p className="font-normal text-sm leading-5 text-black dark:text-black-0">{type === "habit" ? "累積數量" : "累積存款"}</p>
              {type === "habit" ? (
                <div className="flex items-center gap-1">
                  <p className="font-bold text-base leading-6 text-black dark:text-black-0">{user.completedCount}</p>
                  <p className="font-normal text-sm leading-5 text-black dark:text-black-0">次</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <p className="font-bold text-base leading-6 text-black dark:text-black-0">{user.totalSavings}</p>
                  <p className="font-normal text-sm leading-5 text-black dark:text-black-0">元</p>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TopTenUsersList;

TopTenUsersList.propTypes = {
  userCounts: PropTypes.array,
  type: PropTypes.string,
  calculateLevelAndPoints: PropTypes.func,
};
