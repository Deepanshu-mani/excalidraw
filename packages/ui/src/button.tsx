"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({
  children,

  onClick,
}: ButtonProps) => {
  return (
    <button
      className="px-4 py-2 rounded-2xl border border-white/20 bg-black text-white cursor-pointer hover:bg-white/10 "
      onClick={onClick}
    >
      {children}
    </button>
  );
};
