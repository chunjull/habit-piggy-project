import PropTypes from "prop-types";

const DetailModal = ({ selectedHabit, handleDetailModal, handlePostModal, uncompletedFine, handleEditModal, habitCategories }) => {
  const habitCategory = habitCategories.find((category) => category.id === selectedHabit.category);
  const HabitIcon = habitCategory ? habitCategory.icon : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">{HabitIcon && <HabitIcon className="w-8 h-8" />}</div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <h3>{selectedHabit.title}</h3>
              <button onClick={() => handleEditModal(selectedHabit)}>edit</button>
            </div>
            <p>{selectedHabit.frequency.type}</p>
          </div>
        </div>
        <button onClick={handleDetailModal}>close</button>
      </div>
      <div className="flex justify-between">
        <h3>養成期間：</h3>
        <p>
          {selectedHabit.startDate}～{selectedHabit.endDate}
        </p>
      </div>
      <div className="grid grid-cols-10 gap-3">
        {selectedHabit.status.map((status, index) => (
          <div key={index} className={`border aspect-square ${index < selectedHabit.status.filter((s) => s.completed).length ? "bg-yellow-400" : ""}`}></div>
        ))}
      </div>
      <div className="flex justify-between">
        <p>累積存款：</p>
        <p>NT$ {uncompletedFine}</p>
      </div>
      <button className="py-1 w-full bg-yellow-400" onClick={handlePostModal}>
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
