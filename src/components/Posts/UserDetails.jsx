import PropTypes from "prop-types";

const UserDetails = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className="flex items-center gap-3">
      <img src={userData.avatar} alt="avatar" className="w-12 h-12 object-cover rounded-full outline outline-primary-dark dark:outline-primary" />
      <p className="font-bold text-lg leading-6 text-black dark:text-black-0">{userData.name}</p>
    </div>
  );
};

export default UserDetails;

UserDetails.propTypes = {
  userData: PropTypes.object,
};
