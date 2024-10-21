import PropTypes from "prop-types";

const CurrentUser = ({
  userCounts,
  currentUser,
  type,
  calculateLevelAndPoints,
}) => {
  const currentUserData = userCounts.find(
    (user) => user.uid === currentUser.uid,
  );
  if (!currentUserData) {
    return null;
  }
  const rank = userCounts.findIndex((user) => user.uid === currentUser.uid) + 1;
  const { level } = calculateLevelAndPoints(currentUserData.levelPoints);
  return (
    <div className="flex justify-between rounded-2xl bg-black-500 px-4 py-2 dark:bg-black-50">
      <div className="flex items-center gap-3 text-black-0 dark:text-black">
        <p className="h-auto w-10 text-center font-lobster text-3xl font-normal leading-9 text-black-0 dark:text-black">
          {rank}
        </p>
        <img
          src={currentUserData.avatar}
          alt="user's avatar"
          className="h-12 w-12 rounded-full object-cover outline outline-primary dark:outline-primary-dark"
        />
        <div>
          <p className="text-lg font-normal leading-7 text-white dark:text-black">
            {currentUserData.name}
          </p>
          <p className="text-sm font-normal leading-5 text-black-200 dark:text-black-700">
            Lv.{level}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end text-black-0 dark:text-black">
        <p className="text-sm font-normal leading-5">
          {type === "habit" ? "累積數量" : "累積存款"}
        </p>
        {type === "habit" ? (
          <div className="flex items-center gap-1">
            <p className="text-base font-bold leading-6 text-black-0 dark:text-black">
              {currentUserData.completedCount}
            </p>
            <p className="text-sm font-normal leading-5 text-black-0 dark:text-black">
              次
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <p className="text-base font-bold leading-6 text-black-0 dark:text-black">
              {currentUserData.totalSavings}
            </p>
            <p className="text-sm font-normal leading-5 text-black-0 dark:text-black">
              元
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentUser;

CurrentUser.propTypes = {
  userCounts: PropTypes.array,
  currentUser: PropTypes.object,
  type: PropTypes.string,
  calculateLevelAndPoints: PropTypes.func,
};
