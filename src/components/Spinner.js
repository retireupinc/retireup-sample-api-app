import React from "react";

function Spinner(props) {
  const { className = "" } = props;
  return (
    <div className={`${className}${className ? " loading" : "loading"}`}>
      <span className="invisible">Loading</span>
    </div>
  );
}

export default Spinner;
