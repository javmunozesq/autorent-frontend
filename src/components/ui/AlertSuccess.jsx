import React from "react";

export default function AlertSuccess({ children, className = "" }) {
  if (!children) return null;
  return (
    <div className={`alert alert-success ${className}`} role="alert" style={{ margin: 0 }}>
      {children}
    </div>
  );
}