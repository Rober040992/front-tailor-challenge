"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type DropdownProps = Readonly<{
  children: ReactNode;
  containerClassName?: string;
  menuPanelClassName?: string;
  renderTriggerContent: (isOpen: boolean) => ReactNode;
  triggerButtonClassName?: string;
}>;

export function Dropdown({
  children,
  containerClassName = "",
  menuPanelClassName = "",
  renderTriggerContent,
  triggerButtonClassName = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const menuPanelId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div
      className={`relative inline-block text-left ${containerClassName}`}
      ref={dropdownContainerRef}
    >
      <button
        aria-controls={isOpen ? menuPanelId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={triggerButtonClassName}
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        type="button"
      >
        {renderTriggerContent(isOpen)}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 z-30 mt-3 min-w-56 overflow-hidden rounded-tailor-md border border-tailor-border bg-tailor-blue shadow-2xl ${menuPanelClassName}`}
          id={menuPanelId}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}
