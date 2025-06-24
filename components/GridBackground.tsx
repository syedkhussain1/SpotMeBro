import React from "react";

function GridBackground() {
  return (
    <div className="fixed inset-0 -z-1">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white"></div>
      <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
    </div>
  );
}

export default GridBackground;
