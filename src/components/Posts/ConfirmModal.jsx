import PropTypes from "prop-types";

const ConfirmModal = ({
  showConfirmModal,
  setShowConfirmModal,
  confirmAction,
}) => {
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-black-800">
        <p className="mb-4 text-black dark:text-white">
          你確定要執行這個操作嗎？
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-lg bg-gray-300 px-3 py-1"
            onClick={() => setShowConfirmModal(false)}
          >
            取消
          </button>
          <button
            className="rounded-lg bg-primary px-3 py-1 text-black"
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
