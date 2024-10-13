import PropTypes from "prop-types";

const CurrentUser = ({ userCounts, currentUser, type, calculateLevelAndPoints }) => {
  const currentUserData = userCounts.find((user) => user.uid === currentUser.uid);
  if (!currentUserData) {
    return null;
  }
  const rank = userCounts.findIndex((user) => user.uid === currentUser.uid) + 1;
  const { level } = calculateLevelAndPoints(currentUserData.levelPoints);
  return (
    <div className="flex justify-between py-2 px-4 bg-black-500 dark:bg-black-50 rounded-2xl">
      <div className="flex items-center gap-3 text-black-0 dark:text-black">
        <p className="w-10 h-auto font-normal text-center text-3xl leading-9 font-lobster text-black-0 dark:text-black">{rank}</p>
        <img src={currentUserData.avatar} alt="user's avatar" className="w-12 h-12 rounded-full object-cover outline dark:outline-primary-dark outline-primary" />
        <div>
          <p className="font-normal text-lg leading-7 text-white dark:text-black">{currentUserData.name}</p>
          <p className="font-normal text-sm leading-5 text-black-200 dark:text-black-700">Lv.{level}</p>
        </div>
      </div>
      <div className="flex flex-col items-end text-black-0 dark:text-black">
        <p className="font-normal text-sm leading-5">{type === "habit" ? "累積數量" : "累積存款"}</p>
        {type === "habit" ? (
          <div className="flex items-center gap-1">
            <p className="font-bold text-base leading-6 text-black-0 dark:text-black">{currentUserData.completedCount}</p>
            <p className="font-normal text-sm leading-5 text-black-0 dark:text-black">次</p>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <p className="font-bold text-base leading-6 text-black-0 dark:text-black">{currentUserData.totalSavings}</p>
            <p className="font-normal text-sm leading-5 text-black-0 dark:text-black">元</p>
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
