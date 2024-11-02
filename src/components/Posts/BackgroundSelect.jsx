import PropTypes from "prop-types";

const BackgroundSelect = ({
  backgrounds,
  setPostBackground,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div
      className={`absolute left-0 right-0 top-16 z-10 rounded-lg border border-black-500 bg-black-0 px-4 py-2 ${isOpen ? "block" : "hidden"}`}
    >
      <div className="flex gap-4 overflow-scroll">
        {backgrounds.map((url, index) => (
          <button
            key={index}
            className="h-6 w-6 flex-shrink-0 flex-grow-0 rounded"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => {
              setPostBackground(url);
              setIsOpen(false);
            }}
          />
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
