import PropTypes from "prop-types";

const MemberInformation = ({
  profileData,
  currentImage,
  level,
  points,
  isLoading,
}) => (
  <div className="rounded-2xl bg-black-50 p-4 dark:bg-black-800">
    {isLoading ? (
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-black-200" />
          <div className="h-6 w-1/4 rounded-lg bg-black-200" />
        </div>
        <div className="h-6 w-2/3 rounded-lg bg-black-200" />
        <div className="h-6 w-full rounded-xl bg-black-200" />
      </div>
    ) : (
      <>
        <div className="mb-2 flex items-start justify-between">
          <div className="flex gap-3">
            <img
              src={profileData.avatar}
              alt="user's avatar"
              className="h-12 w-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary"
            />
            <div className="flex flex-col">
              <h3 className="text-base font-bold leading-6 text-black dark:text-black-0">
                {profileData.name}
              </h3>
              <p className="text-sm font-normal leading-5 text-black dark:text-black-0">
                Lv.{level}
              </p>
            </div>
          </div>
        </div>
        <p className="mb-4 text-base font-normal leading-6 text-black dark:text-black-0">
          {profileData.introduction}
        </p>
        <div className="relative h-6 w-full rounded-2xl bg-light text-center text-black dark:bg-black-950 dark:text-black-0">
          <div
            className="relative h-full rounded-2xl bg-primary-dark"
            style={{ width: `${points}%` }}
          >
            <img
              src={currentImage}
              alt="habit piggy"
              className="absolute top-2/3 z-20 h-14 w-14 -translate-y-2/3 transform object-cover"
              style={{ right: "-20px" }}
            />
          </div>
          <span className="absolute inset-0 flex items-center justify-center">
            {points}%
          </span>
        </div>
      </>
    )}
  </div>
);

export default MemberInformation;

MemberInformation.propTypes = {
  profileData: PropTypes.object.isRequired,
  currentImage: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
};
