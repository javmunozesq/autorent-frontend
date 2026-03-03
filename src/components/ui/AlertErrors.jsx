import React from "react";

export default function AlertErrors({ errors }) {
  if (!errors || (Array.isArray(errors) && errors.length === 0)) return null;
  const list = Array.isArray(errors) ? errors : [errors];
  return (
    <div className="alert alert-danger" role="alert">
      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
        {list.map((e, i) => <li key={i}>{String(e)}</li>)}
      </ul>
    </div>
  );
}