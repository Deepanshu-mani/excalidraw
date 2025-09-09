import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  className?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {label && (
        <label style={{ fontSize: "14px", fontWeight: 500 }}>{label}</label>
      )}
      <input
        {...props}
        className={className}
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          // placeholder color will be set via CSS below
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "1px solid #3b82f6";
          e.currentTarget.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.5)";
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "1px solid rgba(255,255,255,0.2)";
          e.currentTarget.style.boxShadow = "none";
          if (props.onBlur) props.onBlur(e);
        }}
      />
      <style>{`
        input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
