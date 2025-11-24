import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, Settings, User, LogOut } from "lucide-react";

// Popover Component
interface PopoverProps {
  anchor: string;
  children: React.ReactNode;
  position?: "below" | "above" | "left" | "right";
  className?: string;
  onStateChange?: (state: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({
  anchor,
  children,
  position = "below",
  className = "",
  onStateChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  function handleStateChanges(state: boolean) {
    setIsOpen(state);
    onStateChange(state);
  }

  useEffect(() => {
    const element = document.getElementById(anchor);
    if (element) {
      setAnchorEl(element);

      const handleAnchorClick = () =>
        setIsOpen((prev) => {
          handleStateChanges(!prev);
          return !prev;
        });
      element.addEventListener("click", handleAnchorClick);

      return () => {
        element.removeEventListener("click", handleAnchorClick);
      };
    }
  }, [anchor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        handleStateChanges(!isOpen);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, anchorEl]);

  if (!anchorEl) return null;

  // Get anchor position
  const rect = anchorEl.getBoundingClientRect();
  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 50,
  };

  switch (position) {
    case "below":
      style.top = rect.bottom + 12;
      style.left = rect.left;
      break;
    case "above":
      style.bottom = window.innerHeight - rect.top + 12;
      style.left = rect.left;
      break;
    case "left":
      style.top = rect.top;
      style.right = window.innerWidth - rect.left + 12;
      break;
    case "right":
      style.top = rect.top;
      style.left = rect.right + 12;
  }

  const base = `flex flex-col bg-slate-100 dark:bg-stone-800/90 dark:border border-stone-700 backdrop-blur-xl rounded-lg drop-shadow-lg`;
  const transition = `transition-all duration-150`;
  const visibility = isOpen
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  return (
    <div
      ref={popoverRef}
      style={style}
      className={`${visibility} ${transition} flex flex-col`}
    >
      <div className={`${base} ${className}`}>{children}</div>
    </div>
  );
};

// PopoverItem Component
interface PopoverItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const PopoverItem: React.FC<PopoverItemProps> = ({
  icon,
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
