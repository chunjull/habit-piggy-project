import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import habitPiggyLoading1 from "../../assets/images/habit-piggy-loading-1.svg";
import habitPiggyLoading2 from "../../assets/images/habit-piggy-loading-2.svg";

const LoadingScreen = ({ isLoading }) => {
  const [currentImage, setCurrentImage] = useState(habitPiggyLoading1);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) =>
          prevImage === habitPiggyLoading1
            ? habitPiggyLoading2
            : habitPiggyLoading1,
        );
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <img
        src={currentImage}
        alt="loading"
        className="h-60 w-60 object-cover"
      />
      <p className="text-lg font-normal leading-6 text-black dark:text-black-0">
        準備好培養習慣了嗎？
      </p>
    </div>
  );
};

export default LoadingScreen;

LoadingScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
