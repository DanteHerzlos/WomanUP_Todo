import React, { ReactElement } from "react";
import cl from "./Modal.module.less";

interface ModalProps {
  /**
   * Function that hides modal component
   */
  onClose?: React.MouseEventHandler<HTMLSpanElement>;
  /**
   * React component inside Modal
   */
  children?: ReactElement;
}


/**
 * Modal component.
 *
 * @component Modal
 * 
 */
const Modal:React.FC<ModalProps> = ({onClose, children}) => {
  return (
    <div onClick={onClose} className={cl.modalContainer}>
      <div onClick={e => e.stopPropagation()} className={cl.modal}>
        <span onClick={onClose} className={cl.closeBtn}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
