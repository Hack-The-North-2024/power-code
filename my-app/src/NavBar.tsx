import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from './assets/logo.png';

const NavBar: React.FC = () => {
  return (
    <nav 
      className="bg-white fixed top-0 left-0 w-full z-10 flex justify-center items-center py-2" 
      style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)" }} // Darker shadow
    >
      <Link to="/"> {/* Wrap the img in a Link component */}
        <img
          src={logo} // Adjust the path to your logo
          alt="Logo"
          className="w-70 h-24"
        />
      </Link>
    </nav>
  );
};

export default NavBar;
