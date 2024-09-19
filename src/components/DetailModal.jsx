import PropTypes from "prop-types";

const DetailModal = ({ selectedHabit, handleDetailModal, handlePostModal, uncompletedFine }) => (
  <>
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-yellow-400"></div>
        <div className="flex flex-col">
          <div className="flex gap-2">
            <h3>{selectedHabit.title}</h3>
            <button>edit</button>
          </div>
          <p>{selectedHabit.frequency}</p>
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
        <div key={index} className={`border h-9 md:h-12 ${index < selectedHabit.status.filter((s) => s.completed).length ? "bg-yellow-400" : ""}`}></div>
      ))}
    </div>
    <div className="flex justify-between">
      <p>累積存款：</p>
      <p>NT$ {uncompletedFine}</p>
    </div>
    <button className="py-1 w-full bg-yellow-400" onClick={handlePostModal}>
      發佈貼文
    </button>
  </>
);

DetailModal.propTypes = {
  selectedHabit: PropTypes.object.isRequired,
  handleDetailModal: PropTypes.func.isRequired,
  handlePostModal: PropTypes.func.isRequired,
  uncompletedFine: PropTypes.number.isRequired, // 新增 propTypes 驗證
};

export default DetailModal;
