import PropTypes from "prop-types";

const MemberInformation = ({ profileData, currentImage, level, points }) => (
  <div className="p-4 bg-black-50 dark:bg-black-800 rounded-2xl">
    <div className="flex justify-between items-start mb-2">
      <div className="flex gap-3">
        <img src={profileData.avatar} alt="user's avatar" className="w-12 h-12 rounded-full outline object-cover outline-primary-dark dark:outline-primary" />
        <div className="flex flex-col">
          <h3 className="font-bold text-base leading-6 text-black dark:text-black-0">{profileData.name}</h3>
          <p className="font-normal text-sm leading-5 text-black dark:text-black-0">Lv.{level}</p>
        </div>
      </div>
    </div>
    <p className="font-normal text-base leading-6 text-black dark:text-black-0 mb-4">{profileData.introduction}</p>
    <div className="w-full h-6 bg-light dark:bg-black-950 text-center rounded-2xl text-black dark:text-black-0 relative">
      <div className="bg-primary-dark h-full rounded-2xl relative" style={{ width: `${points}%` }}>
        <img src={currentImage} alt="habit piggy" className="w-14 h-14 absolute top-2/3 transform -translate-y-2/3 z-20 object-cover" style={{ right: "-20px" }} />
      </div>
      <span className="absolute inset-0 flex items-center justify-center">{points}%</span>
    </div>
  </div>
);

export default MemberInformation;

MemberInformation.propTypes = {
  profileData: PropTypes.object.isRequired,
  currentImage: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
};
