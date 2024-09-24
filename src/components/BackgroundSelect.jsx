import PropTypes from "prop-types";

const BackgroundSelect = ({ backgrounds, setPostBackground, isOpen, setIsOpen }) => {
  return (
    <div className={`absolute top-14 left-0 right-0 z-10 bg-white border p-4 ${isOpen ? "block" : "hidden"}`}>
      <div className="flex gap-4 overflow-scroll">
        {backgrounds.map((url, index) => (
          <button
            key={index}
            className="rounded w-6 h-6 flex-shrink-0 flex-grow-0"
            style={{ backgroundImage: `url(${url})` }}
            onClick={() => {
              setPostBackground(url);
              setIsOpen(false);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
};

BackgroundSelect.propTypes = {
  backgrounds: PropTypes.array.isRequired,
  setPostBackground: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default BackgroundSelect;