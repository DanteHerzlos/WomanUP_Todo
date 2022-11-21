import React, { ReactElement } from 'react'
import cl from './Button.module.less'

interface ButtonProps {
  /**
   * Action when click on Button
   */
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  /**
   * React component or string inside button. e.g. for Loader
   */
  children?: ReactElement | string;
  /**
   * Disable state for button
   */
  disabled?: boolean;
}
/**
 * Custom Button
 *
 * @component Button
 *
 */
const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      className={cl.btn}
      onClick={onClick}
      type={"submit"}
    >
      {children}
    </button>
  );
};

export default Button