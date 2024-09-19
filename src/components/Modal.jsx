import PropTypes from "prop-types";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-4 bg-slate-100 w-2/3 h-fit space-y-4 md:w-1/2 md:ml-40">
        <div className="flex justify-between items-center">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
