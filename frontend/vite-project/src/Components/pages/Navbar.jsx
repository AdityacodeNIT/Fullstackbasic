import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

const Navbar = () => {
  const { userDetail } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#00B4D8] to-[#0096C7] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
    
        <div className="flex items-center text-2xl font-bold space-x-2">
          <span className="text-3xl">📚</span>
          <span className="font-serif text-white">BookVerse</span>
        </div>

      
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </div>
          </button>
        </div>

    
        <div className={`md:flex items-center space-x-6 ${menuOpen ? "block absolute top-20 left-0 w-full bg-white text-[#023047] shadow-md p-4" : "hidden md:flex"} transition-all duration-300`}>
          <Link
            to="/"
            className="block md:inline-block text-lg font-semibold hover:text-[#FFB703]"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/Aboutus"
            className="block md:inline-block text-lg font-semibold hover:text-[#FFB703]"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>
          {userDetail?.data?.user ? (
            <Link
              to="/user"
              className="block md:inline-block text-lg font-semibold hover:text-[#FFB703]"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="mt-3 md:mt-0 inline-block px-5 py-2 border border-[#FFB703] text-[#FFB703] rounded-full font-semibold hover:bg-[#FFB703] hover:text-[#023047] transition"
              onClick={() => setMenuOpen(false)}
            >
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
