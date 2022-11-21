import React from "react";
import cl from "./ErrorMessage.module.less";

interface ErrorMessageProps {
  /**
   * Error message
   */
  message: string;
  /**
   * Сomponent click event
   */
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Сomponent for displaying `Error` messages
 *
 * @component ErrorMessage
 *  
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClick }) => {
  return (
    <div onClick={onClick} className={message ? cl.message : cl.hide}>
      {message}
    </div>
  );
};

export default ErrorMessage;
