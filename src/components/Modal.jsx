import PropTypes from "prop-types";
import React from "react";
import SettingModal from "./SettingModal";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  const isSettingModal = React.isValidElement(children) && children.type === SettingModal;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`rounded-2xl py-6 px-4 w-2/3 h-fit bg-black-50 max-h-[80vh] overflow-auto space-y-4 ${isSettingModal ? "" : "transform top-1/2 translate-y-[-50%]"}`}>{children}</div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
