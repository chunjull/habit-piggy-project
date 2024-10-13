import PropTypes from "prop-types";

const ConfirmModal = ({ showConfirmModal, setShowConfirmModal, confirmAction }) => {
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black-800 p-4 rounded-xl shadow-lg">
        <p className="text-black dark:text-white mb-4">你確定要執行這個操作嗎？</p>
        <div className="flex justify-end gap-2">
          <button className="py-1 px-3 bg-gray-300 rounded-lg" onClick={() => setShowConfirmModal(false)}>
            取消
          </button>
          <button
            className="py-1 px-3 bg-primary rounded-lg text-black"
            onClick={() => {
              confirmAction();
              setShowConfirmModal(false);
            }}
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

ConfirmModal.propTypes = {
  showConfirmModal: PropTypes.bool.isRequired,
  setShowConfirmModal: PropTypes.func.isRequired,
  confirmAction: PropTypes.func.isRequired,
};
