"use client";

export default function Modal({
  children,
  open = false,
  onClose,
  containerClassName = "",
  modalClassName = "",
}: {
  children: React.ReactNode;
  open?: boolean;
  onClose: () => void;
  containerClassName?: string;
  modalClassName?: string;
}) {
  if (!open) return null;

  function stopPropagation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <div
      className={`fixed z-50 inset-0 overflow-y-auto min-h-screen min-w-full bg-black/40 ${containerClassName}`}
      onClick={onClose}
    >
      <div className={modalClassName} onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
}
