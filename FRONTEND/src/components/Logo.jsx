import React from "react";
import logoImage from "../assets/Logo.svg"; // Import the image from your assets folder

function Logo({ width = "100px" }) {
  return (
    <img
      src={logoImage} // Use the imported image
      alt="Logo" // Provide an alt text for accessibility
      style={{ width }} // Apply the width prop as inline style
    />
  );
}

export default Logo;
