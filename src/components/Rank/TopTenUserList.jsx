import PropTypes from "prop-types";

const TopTenUsersList = ({
  userCounts,
  type,
  calculateLevelAndPoints,
  isLoading,
}) => {
  const sortedUsers = [...userCounts].sort((a, b) =>
    type === "habit"
      ? b.completedCount - a.completedCount
      : b.totalSavings - a.totalSavings,
  );

  return (
    <ul className="space-y-4">
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <li
            key={index}
            className="w-full space-y-3 rounded-2xl bg-black-50 p-4 dark:bg-black-800"
          >
            <div className="flex w-full animate-pulse items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="aspect-square h-12 w-12 rounded-full bg-black-200" />
                <div className="flex w-60 flex-col gap-1">
                  <div className="h-6 w-1/2 rounded-lg bg-black-200" />
                  <div className="h-5 w-1/3 rounded-lg bg-black-200" />
                </div>
              </div>
              <div className="flex w-60 flex-col items-end gap-1">
                <div className="h-5 w-1/2 rounded-lg bg-black-200" />
                <div className="h-6 w-1/3 rounded-lg bg-black-200" />
              </div>
            </div>
          </li>
        ))}
      {!isLoading &&
        sortedUsers.slice(0, 10).map((user, index) => {
          const { level } = calculateLevelAndPoints(user.levelPoints);
          return (
            <li
              key={user.uid}
              className="relative flex items-center justify-between rounded-2xl bg-black-50 px-4 py-2 hover:bg-black-0 dark:bg-black-800 dark:hover:bg-black-600"
            >
              <div className="flex items-center gap-3">
                {index < 3 ? (
                  <div className="flex items-center gap-3">
                    <div className="absolute top-[-4px]">
                      <div className="relative flex h-[68px] w-10 items-center justify-center bg-primary">
                        <p className="text-center font-lobster text-3xl font-normal leading-9 text-alert">
                          {index + 1}
                        </p>
                        <div className="absolute before:absolute before:bottom-[-34px] before:right-0 before:z-20 before:h-0 before:w-0 before:border-b-[12px] before:border-l-[20px] before:border-r-0 before:border-b-black-50 before:border-l-transparent before:border-r-transparent before:content-[''] dark:before:border-b-black-800" />
                        <div className="absolute before:absolute before:bottom-[-34px] before:left-0 before:z-20 before:h-0 before:w-0 before:border-b-[12px] before:border-l-0 before:border-r-[20px] before:border-b-black-50 before:border-l-transparent before:border-r-transparent before:content-[''] dark:before:border-b-black-800" />
                        <div className="absolute before:absolute before:bottom-[30px] before:left-5 before:z-20 before:h-0 before:w-0 before:border-b-[4px] before:border-l-0 before:border-r-[3px] before:border-b-primary-dark before:border-l-transparent before:border-r-transparent before:content-['']" />
                      </div>
                    </div>
                    <img
                      src={user.avatar}
                      alt="user's avatar"
                      className="ml-14 h-12 w-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary"
                    />
                    <div>
                      <p className="text-lg font-normal leading-7 text-black dark:text-black-0">
                        {user.name}
                      </p>
                      <p className="text-sm font-normal leading-5 text-black-700 dark:text-black-200">
                        Lv.{level}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="h-auto w-10 text-center font-lobster text-3xl font-normal leading-9 text-black dark:text-black-0">
                      {index + 1}
                    </p>
                    <img
                      src={user.avatar}
                      alt="user's avatar"
                      className="h-12 w-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary"
                    />
                    <div>
                      <p className="text-lg font-normal leading-7 text-black dark:text-black-0">
                        {user.name}
                      </p>
                      <p className="text-sm font-normal leading-5 text-black-700 dark:text-black-200">
                        Lv.{level}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* User Stats */}
              <div className="flex flex-col items-end">
                <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
                  {type === "habit" ? "累積數量" : "累積存款"}
                </p>
                {type === "habit" ? (
                  <div className="flex items-center gap-1">
                    <p className="text-base font-bold leading-6 text-black dark:text-black-0">
                      {user.completedCount}
                    </p>
                    <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
                      次
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <p className="text-base font-bold leading-6 text-black dark:text-black-0">
                      {user.totalSavings}
                    </p>
                    <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
                      元
                    </p>
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
  isLoading: PropTypes.bool,
};
