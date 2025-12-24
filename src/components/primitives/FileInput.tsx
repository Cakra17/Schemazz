import type React from "react";
import { Button, type ButtonVariant } from "./Button";

interface FileInput extends React.InputHTMLAttributes<HTMLInputElement> {
  ref: React.Ref<HTMLInputElement>
  variant?: ButtonVariant;
  disableEffect?: boolean;
  isActive?: boolean;
  onInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function FileInput({
  className = "",
  children,
  variant = "primary",
  onButtonClick,
  onInputFileChange,
  ref,
  ...props
}: FileInput) {
  return (
    <>
      <input 
        className="hidden"
        accept=".sql"
        type="file"
        ref={ref}
        onChange={onInputFileChange}
        {...props}
      />
      <Button 
        variant={variant} 
        className={`${className}`} 
        onClick={onButtonClick}
        > 
        {children}
      </Button>
    </>
  )
}