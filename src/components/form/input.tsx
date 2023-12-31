"use client";

import { useRef, useEffect } from "react";
import { IconType } from "react-icons/lib";

interface InputProps {
  label?: string;
  placeholder?: string;
  type: "text" | "password" | "email" | "number";
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  autoComplete?: "off" | "on";
  required?: boolean;
  name?: string;
  id?: string;
  multiline?: boolean;
  rows?: number;
  containerClassName?: string;
  textAreaClassName?: string;
  inputClassName?: string;
  Icon?: IconType;
  iconPosition?: "left" | "right";
  iconClassName?: string;
}

export default function Input(props: InputProps) {
  const {
    label,
    placeholder = "",
    type = "text",
    value = "",
    onChange,
    autoComplete = "off",
    required = false,
    name,
    id,
    multiline = false,
    rows = 1,
    containerClassName = "",
    textAreaClassName = "",
    inputClassName = "",
    Icon,
    iconPosition = "left",
    iconClassName = "",
  } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);

  return (
    <div className={`flex flex-col gap-1 max-w-full ${containerClassName}`}>
      {props.label && (
        <label htmlFor={name} className="text-slate-300">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className={`rounded bg-slate-900 outline-slate-600 outline outline-2 focus:outline-slate-300 text-slate-200 py-1 px-2 ${textAreaClassName}`}
          id={id}
          name={name}
          required={required}
          onChange={onChange}
          value={value}
          rows={rows}
          placeholder={placeholder}
          ref={textAreaRef}
        ></textarea>
      ) : (
        <div
          className={`flex items-center rounded p-1 bg-slate-900 outline-slate-600 outline outline-2 focus-within:outline-slate-300 text-slate-200 ${inputClassName}`}
        >
          {Icon && iconPosition === "left" && (
            <Icon className={`${iconClassName}`} />
          )}
          <input
            className={`bg-transparent w-full h-full py-1 px-2 outline-none`}
            onChange={onChange}
            type={type}
            value={value}
            autoComplete={autoComplete}
            required={required}
            id={id}
            name={name}
            placeholder={placeholder}
          />
          {Icon && iconPosition === "right" && (
            <Icon className={`${iconClassName}`} />
          )}
        </div>
      )}
    </div>
  );
}
