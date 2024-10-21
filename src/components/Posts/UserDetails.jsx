import PropTypes from "prop-types";

const UserDetails = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className="flex items-center gap-3">
      <img
        src={userData.avatar}
        alt="avatar"
        className="h-12 w-12 rounded-full object-cover outline outline-primary-dark dark:outline-primary"
      />
      <p className="text-lg font-bold leading-6 text-black dark:text-black-0">
        {userData.name}
      </p>
    </div>
  );
};

export default UserDetails;

UserDetails.propTypes = {
  userData: PropTypes.object,
};
