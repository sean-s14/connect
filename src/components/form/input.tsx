"use client";

interface InputProps {
  label?: string;
  type: "text" | "password" | "email" | "number";
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  autoComplete?: "off" | "on";
  required?: boolean;
  name?: string;
  id?: string;
  multiline?: boolean;
}

export default function Input(props: InputProps) {
  const {
    label,
    type = "text",
    value = "",
    onChange,
    autoComplete = "off",
    required = false,
    name,
    id,
    multiline = false,
  } = props;
  return (
    <div className="flex flex-col gap-1 max-w-full w-72">
      {props.label && (
        <label htmlFor={name} className="text-slate-300">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className="rounded bg-slate-950 outline-slate-600 outline outline-2 focus:outline-slate-300 text-slate-200 py-1 px-2"
          id={id}
          name={name}
          required={required}
          onChange={onChange}
          value={value}
        ></textarea>
      ) : (
        <input
          className="rounded bg-slate-950 outline-slate-600 outline outline-2 focus:outline-slate-300 text-slate-200 py-1 px-2"
          onChange={(e) => onChange(e)}
          type={type}
          value={value}
          autoComplete={autoComplete}
          required={required}
          id={id}
          name={name}
        />
      )}
    </div>
  );
}
