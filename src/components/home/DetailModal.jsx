import PropTypes from "prop-types";
import { useState } from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/animation/stamp-animation.json";
import { modalIcons } from "../../assets/icons";

const DetailModal = ({
  selectedHabit,
  handleDetailModal,
  uncompletedFine,
  handleEditModal,
  habitCategories,
}) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const habitCategory = habitCategories.find(
    (category) => category.id === selectedHabit.category,
  );
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
    const bottomClass =
      position.bottom >= 0
        ? `bottom-${position.bottom}`
        : `-bottom-${Math.abs(position.bottom)}`;
    const leftClass =
      position.left >= 0
        ? `left-${position.left}`
        : `-left-${Math.abs(position.left)}`;
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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
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
      <div
        className={`${!isAnimationComplete ? "opacity-50" : "opacity-100"} space-y-4 transition-opacity duration-500`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              {HabitIcon && <HabitIcon className="h-8 w-8" />}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="line-clamp-1 text-lg font-bold leading-6 text-black dark:text-black-0">
                  {selectedHabit.title}
                </h3>
              </div>
            </div>
          </div>
          <modalIcons.TbX
            className="h-6 w-6 cursor-pointer text-black hover:text-alert dark:text-black-0"
            onClick={handleDetailModal}
          />
        </div>
        <div className="flex justify-between">
          <h3 className="text-black dark:text-black-0">養成頻率：</h3>
          <p className="text-black dark:text-black-0">
            {renderType(selectedHabit.frequency)}
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-black dark:text-black-0">養成期間：</h3>
          <p className="text-black dark:text-black-0">
            {selectedHabit.startDate}～{selectedHabit.endDate}
          </p>
        </div>
        <div className="grid max-h-40 grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden md:grid-cols-7 md:gap-3 2xl:grid-cols-10">
          {selectedHabit.status.map((status, index) => (
            <div
              key={index}
              className="relative aspect-square rounded border border-black-500 bg-black-50 dark:border-black-300"
            >
              {status.completed && (
                <div
                  className={`absolute flex aspect-square items-center justify-center rounded-full border-2 border-alert ${getPositionClasses(stampPosition[index % stampPosition.length])}`}
                >
                  <p className="flex h-10 w-12 -rotate-[30deg] items-center justify-center p-1 font-lobster text-sm font-normal leading-5 text-alert">
                    {new Date(status.date).toLocaleDateString("zh-TW", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
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
        <button
          className="w-full rounded-lg bg-primary py-1 text-sm font-medium leading-5 hover:bg-primary-dark"
          onClick={() => handleEditModal(selectedHabit)}
        >
          編輯習慣
        </button>
      </div>
    </div>
  );
};

DetailModal.propTypes = {
  selectedHabit: PropTypes.object,
  handleDetailModal: PropTypes.func.isRequired,
  uncompletedFine: PropTypes.number.isRequired,
  handleEditModal: PropTypes.func.isRequired,
  habitCategories: PropTypes.array.isRequired,
};

export default DetailModal;
