import React from 'react'
import cl from './Textarea.module.less'

interface TextareaProps {
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Textarea name
   */
  name?: string;
  /**
   * Textarea id
   */
  id?: string;
  /**
   * Textarea onChange method
   */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /**
   * Textarea value
   */
  value?: string | number | readonly string[] | undefined;
  /**
   * Textarea defaultValue
   */
  defaultValue?: string | number | readonly string[] | undefined;
}

/**
 * Custom `<textarea>` component.
 *
 * @component Textarea
 *
 */
const Textarea: React.FC<TextareaProps> = ({
  defaultValue, 
  placeholder,
  name,
  value,
  onChange,
  id,
}) => {
  return (
    <textarea
      defaultValue={defaultValue}
      className={cl.input}
      rows={7}
      cols={23}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      id={id}
    />
  );
};

export default Textarea