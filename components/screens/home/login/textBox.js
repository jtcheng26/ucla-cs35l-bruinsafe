import React, { useState } from "react";
import "./login.css";

function TextBox({className, placeholder}) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    // Perform any action you want when the button is clicked
    console.log("Button Clicked");
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={className}
        placeholder={placeholder}
      />
    </div>
  );
}

export default TextBox;
