import React from "react";
import cl from "./TextInput.module.less";

interface TextInputProps {
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Input name
   */
  name?: string;
  /**
   * Input id
   */
  id?: string;
  /**
   * Input onChange method
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /**
   * Input value
   */
  value?: string | number | readonly string[] | undefined;
  /**
   * Input defaultValue
   */
  defaultValue?: string | number | readonly string[] | undefined;
}

/**
 * Custom input component with `type="text"`.
 *
 * @component Text Input
 *
 */
const TextInput: React.FC<TextInputProps> = ({
  defaultValue,
  placeholder,
  name,
  id,
  onChange,
  value,
}) => {
  return (
    <input
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      className={cl.input}
      type="text"
      id={id}
      name={name}
      placeholder={placeholder}
    />
  );
};

export default TextInput;
