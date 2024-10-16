import { useEffect, useState } from "react";
import habitPiggyLoading1 from "../../assets/images/habit-piggy-loading-1.svg";
import habitPiggyLoading2 from "../../assets/images/habit-piggy-loading-2.svg";
import PropTypes from "prop-types";

const LoadingScreen = ({ isLoading }) => {
  const [currentImage, setCurrentImage] = useState(habitPiggyLoading1);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage === habitPiggyLoading1 ? habitPiggyLoading2 : habitPiggyLoading1));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <img src={currentImage} alt="loading" className="w-60 h-60 object-cover" />
      <p className="font-normal text-lg leading-6 text-black dark:text-black-0">準備好培養習慣了嗎？</p>
    </div>
  );
};

export default LoadingScreen;

LoadingScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
