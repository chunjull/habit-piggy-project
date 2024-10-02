import PropTypes from "prop-types";
import { modalIcons } from "../assets/icons";

const DetailModal = ({ selectedHabit, handleDetailModal, handlePostModal, uncompletedFine, handleEditModal, habitCategories }) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">{HabitIcon && <HabitIcon className="w-8 h-8" />}</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg leading-6">{selectedHabit.title}</h3>
              <modalIcons.TbPencil className="w-6 h-6 cursor-pointer hover:text-alert" onClick={() => handleEditModal(selectedHabit)} />
            </div>
          </div>
        </div>
        <modalIcons.TbX className="w-6 h-6 hover:text-alert cursor-pointer" onClick={handleDetailModal} />
      </div>
      <div className="flex justify-between">
        <h3>養成頻率：</h3>
        <p>{renderType(selectedHabit.frequency)}</p>
      </div>
      <div className="flex justify-between">
        <h3>養成期間：</h3>
        <p>
          {selectedHabit.startDate}～{selectedHabit.endDate}
        </p>
      </div>
      <div className="grid grid-cols-5 md:grid-cols-7 2xl:grid-cols-10 gap-2 md:gap-3 max-h-40 overflow-y-auto overflow-x-hidden">
        {selectedHabit.status.map((status, index) => (
          <div key={index} className="border border-black-500 rounded aspect-square relative">
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
        <p>累積存款：</p>
        <p>NT$ {uncompletedFine}</p>
      </div>
      <button className="py-1 w-full bg-primary hover:bg-primary-dark rounded-lg font-medium text-sm leading-5" onClick={handlePostModal}>
        發佈貼文
      </button>
    </div>
  );
};

DetailModal.propTypes = {
  selectedHabit: PropTypes.object.isRequired,
  handleDetailModal: PropTypes.func.isRequired,
  handlePostModal: PropTypes.func.isRequired,
  uncompletedFine: PropTypes.number.isRequired,
  handleEditModal: PropTypes.func.isRequired,
  habitCategories: PropTypes.array.isRequired,
};

export default DetailModal;
