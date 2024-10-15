import { useState } from "react";
import PropTypes from "prop-types";
import { modalIcons } from "../../assets/icons";
import Lottie from "react-lottie";
import animationData from "../../assets/animation/stamp-animation.json";

const DetailModal = ({ selectedHabit, handleDetailModal, uncompletedFine, handleEditModal, habitCategories }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const habitCategory = habitCategories.find((category) => category.id === selectedHabit.category);
  const HabitIcon = habitCategory ? habitCategory.icon : null;

  const renderType = (frequency) => {
    switch (frequency.type) {
      case "daily":
        return "每日";
      case "weekly":
        return "每週";
      case "specificDays":
        return "特定日期";
      default:
        return "";
    }
  };

  const stampPosition = [
    { bottom: 0, left: 0 },
    { bottom: 2, left: -1 },
    { bottom: -1, left: -2 },
    { bottom: 2, left: 0 },
    { bottom: 1, left: -1 },
    { bottom: 2, left: -2 },
    { bottom: -2, left: 1 },
    { bottom: 2, left: 1 },
  ];

  const getPositionClasses = (position) => {
    const bottomClass = position.bottom >= 0 ? `bottom-${position.bottom}` : `-bottom-${Math.abs(position.bottom)}`;
    const leftClass = position.left >= 0 ? `left-${position.left}` : `-left-${Math.abs(position.left)}`;
    return `${bottomClass} ${leftClass}`;
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      clearCanvas: false,
    },
  };

  return (
    <div className="relative">
      {!isAnimationComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
            speed={2}
            eventListeners={[
              {
                eventName: "complete",
                callback: () => setIsAnimationComplete(true),
              },
            ]}
          />
        </div>
      )}
      <div className={`${!isAnimationComplete ? "opacity-50" : "opacity-100"} transition-opacity duration-500 space-y-4`}>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">{HabitIcon && <HabitIcon className="w-8 h-8" />}</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-6 text-black dark:text-black-0 line-clamp-1">{selectedHabit.title}</h3>
              </div>
            </div>
          </div>
          <modalIcons.TbX className="w-6 h-6 hover:text-alert cursor-pointer text-black dark:text-black-0" onClick={handleDetailModal} />
        </div>
        <div className="flex justify-between">
          <h3 className="text-black dark:text-black-0">養成頻率：</h3>
          <p className="text-black dark:text-black-0">{renderType(selectedHabit.frequency)}</p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-black dark:text-black-0">養成期間：</h3>
          <p className="text-black dark:text-black-0">
            {selectedHabit.startDate}～{selectedHabit.endDate}
          </p>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-7 2xl:grid-cols-10 gap-2 md:gap-3 max-h-40 overflow-y-auto overflow-x-hidden">
          {selectedHabit.status.map((status, index) => (
            <div key={index} className="border border-black-500 dark:border-black-300 rounded aspect-square bg-black-50 relative">
              {status.completed && (
                <div className={`border-2 border-alert rounded-full aspect-square flex justify-center items-center absolute ${getPositionClasses(stampPosition[index % stampPosition.length])}`}>
                  <p className="font-lobster font-normal text-sm leading-5 text-alert -rotate-[30deg] p-1 w-12 h-10 flex items-center justify-center">
                    {new Date(status.date).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit" })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <p className="text-black dark:text-black-0">累積存款：</p>
          <p className="text-black dark:text-black-0">NT$ {uncompletedFine}</p>
        </div>
        <button className="py-1 w-full bg-primary hover:bg-primary-dark rounded-lg font-medium text-sm leading-5" onClick={() => handleEditModal(selectedHabit)}>
          編輯習慣
        </button>
      </div>
    </div>
  );
};

DetailModal.propTypes = {
  selectedHabit: PropTypes.object.isRequired,
  handleDetailModal: PropTypes.func.isRequired,
  uncompletedFine: PropTypes.number.isRequired,
  handleEditModal: PropTypes.func.isRequired,
  habitCategories: PropTypes.array.isRequired,
};

export default DetailModal;
