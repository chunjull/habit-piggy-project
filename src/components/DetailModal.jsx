import PropTypes from "prop-types";
import { modalIcons } from "../assets/icons";

const DetailModal = ({ selectedHabit, handleDetailModal, handlePostModal, uncompletedFine, handleEditModal, habitCategories }) => {
  const habitCategory = habitCategories.find((category) => category.id === selectedHabit.category);
  const HabitIcon = habitCategory ? habitCategory.icon : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">{HabitIcon && <HabitIcon className="w-8 h-8" />}</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg leading-6">{selectedHabit.title}</h3>
              <modalIcons.TbPencil className="w-6 h-6 cursor-pointer hover:text-alert" onClick={() => handleEditModal(selectedHabit)} />
            </div>
            <p className="font-normal text-xs leading-4">{selectedHabit.frequency.type}</p>
          </div>
        </div>
        <modalIcons.TbX className="w-6 h-6 hover:text-alert cursor-pointer" onClick={handleDetailModal} />
      </div>
      <div className="flex justify-between">
        <h3>養成期間：</h3>
        <p>
          {selectedHabit.startDate}～{selectedHabit.endDate}
        </p>
      </div>
      <div className="grid grid-cols-10 gap-3 max-h-28 overflow-y-auto">
        {selectedHabit.status.map((status, index) => (
          <div key={index} className={`border border-black-500 rounded aspect-square ${index < selectedHabit.status.filter((s) => s.completed).length ? "bg-primary" : ""}`}></div>
        ))}
      </div>
      <div className="flex justify-between">
        <p>累積存款：</p>
        <p>NT$ {uncompletedFine}</p>
      </div>
      <button className="py-1 w-full bg-primary hover:bg-primary-light rounded-lg font-medium text-sm leading-5" onClick={handlePostModal}>
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
