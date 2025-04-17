import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";


import UserContext from "../../context/UserContext";

const Navbar = () => {
  const { userDetail } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar w-full text-white bg-[#1E293B] h-16 px-6 shadow-xl">
      <div className="flex w-full items-center justify-between h-full">
        {/* Logo */}
        <div className="text-[#FACC15] text-2xl lg:text-3xl font-extrabold">
          <span className="text-white">Book</span>Verse
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >

        </button>

        {/* Navigation Links */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center absolute md:static top-20 left-0 w-full md:w-auto bg-[#1E293B] md:bg-transparent md:space-x-8 p-4 md:p-0 z-50 transition-all duration-300`}
        >
          <ul className="flex flex-col md:flex-row w-full md:w-auto items-center space-y-4 md:space-y-0">
            <li className="mx-3 text-md lg:text-lg text-[#FACC15] font-semibold hover:text-[#38BDF8] transition-colors duration-200">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li className="mx-3 text-md lg:text-lg font-semibold text-[#FACC15] hover:text-[#38BDF8] transition-colors duration-200">
              <Link to="/Aboutus" onClick={() => setMenuOpen(false)}>About Us</Link>
            </li>
           
          </ul>
        </div>

        {/* Cart and User Section */}
        <div className="flex items-center space-x-4">
          {userDetail && userDetail.data && userDetail.data.user ? (
            <Link to="/user">
            User DashBoard
            </Link>
          ) : (
            <button className="text-[#FACC15] text-md font-bold px-6 py-3 border-2 border-[#FACC15] rounded-full hover:bg-[#FACC15] hover:text-[#1E293B] transition-colors duration-300">
              <Link to="/register">Login/Register</Link>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
