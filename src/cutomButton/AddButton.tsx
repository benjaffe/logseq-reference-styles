import React from "react";
import "./addButton.css";

export default function DeleteButton(props) {
  return (
    <button {...props} className={`${props.className} icon-btn`}>
      <div class="add-icon"></div>
    </button>
  );
}
