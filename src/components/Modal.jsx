import PropTypes from "prop-types";
import React from "react";
import SettingModal from "../components/Member/SettingModal";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  const isSettingModal =
    React.isValidElement(children) && children.type === SettingModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`h-fit max-h-[80vh] w-11/12 space-y-4 overflow-auto rounded-2xl bg-black-50 px-4 py-6 dark:bg-black-600 md:w-1/3 ${isSettingModal ? "" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
