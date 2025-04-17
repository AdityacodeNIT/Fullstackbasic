import { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import {
  FaHeadset,
  FaShoppingCart,

  FaUserCircle,
  FaUser,
  FaPowerOff,
} from "react-icons/fa";

const UserDetails = () => {
  const { userDetail, setUserDetail } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateRefreshToken = async () => {
      if (!userDetail) return; // Prevents API call if userDetail is null or not available

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        if (accessToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }
        setLoading(false); // End loading state when the token is validated
      } catch (error) {
        console.error("Error validating refresh token:", error);
        setUserDetail(null);
        setLoading(false);
        navigate("/userLogin"); // Redirect to login page if token validation fails
      }
    };

    if (userDetail) {
      validateRefreshToken();
    } else {
      setLoading(false); // If no userDetail, set loading to false to render login prompt
    }
  }, [userDetail, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaShoppingCart className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 p-6">
      {/* Left Section */}
      <div className="md:w-1/3 flex flex-col items-center">
        {userDetail ? (
          <div key={userDetail?.id} className="text-yellow-200 w-full max-w-lg">
            {/* User Info Card */}
            <div className="flex items-center bg-white p-4 rounded-lg shadow-md border">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <img
                  className="w-12 h-12 object-cover rounded-full"
                  src={
                    userDetail?.data?.avatar ||
                    userDetail?.data?.user?.avatar ||
                    "/default-avatar.png"
                  }
                  alt="User avatar"
                />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Hello,</p>
                <p className="text-lg font-bold text-gray-900">
                  {userDetail?.data?.username ||
                    userDetail?.data?.user?.username ||
                    "Guest"}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-3 bg-white shadow-md border rounded-lg p-4">
              <h2 className="text-gray-700 font-bold text-lg mb-3">Navigation</h2>
              <div className="space-y-3">
                {userDetail?.data?.user?.role !== "customer" ? (
                  <>
                    <Link
                      to="/addBooks"
                      className="flex items-center text-gray-600 font-semibold hover:text-indigo-500 transition"
                    >
                      <FaUser className="text-purple-500 mr-2" />
                      Add Books
                    </Link>
              
                          <Link to="/updateDetails" className="flex items-center text-gray-600 font-semibold hover:text-indigo-500 transition">Update Details</Link>
                        

                    <Link
                      to="/logOut"
                      className="flex items-center text-gray-600 font-semibold hover:text-red-600 transition"
                    >
                      <FaPowerOff className="text-blue-500 mr-2" />
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="py-2 border-t">
                      <div className="flex items-center text-gray-500 font-semibold uppercase text-sm">
                        <FaUserCircle className="text-blue-500 mr-2 text-lg" />
                        Account Settings
                      </div>
                      <ul className="mt-2 text-gray-700 pl-6">
                        <li className="py-1 hover:text-blue-600 cursor-pointer">
                          Profile Information
                        </li>

                        <li className="py-1 hover:text-blue-600 cursor-pointer">
                          <Link to="/updateDetails">Update Details</Link>
                        </li>
                      </ul>
                    </div>

                    <Link
                      to="/helpdesk"
                      className="flex items-center text-gray-600 font-semibold hover:text-red-600 transition"
                    >
                      <FaHeadset className="text-purple-500 mr-2" />
                      Helpdesk
                    </Link>

                    <Link
                      to="/logOut"
                      className="flex items-center text-gray-600 font-semibold hover:text-red-600 transition"
                    >
                      <FaPowerOff className="text-blue-500 mr-2" />
                      Logout
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <h2 className="text-lg font-bold">You are not logged in</h2>
            <Link
              to="/userLogin"
              className="block py-2 mt-4 bg-purple-600 px-4 text-center text-white rounded hover:bg-indigo-500 transition"
            >
              Log In
            </Link>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="md:w-2/3">
        <div className="bg-white shadow-md border rounded-lg p-6">
          <h2 className="text-gray-700 font-bold text-lg mb-3">User Details</h2>
          <p className="text-gray-700 font-semibold">
            Name:{" "}
            <span className="text-gray-900 font-medium">
              {userDetail?.data?.fullName ||
                userDetail?.data?.user?.fullName ||
                "N/A"}
            </span>
          </p>
          <p className="text-gray-700 font-semibold mt-2">
            Email:{" "}
            <span className="text-gray-900 font-medium">
              {userDetail?.data?.email ||
                userDetail?.data?.user?.email ||
                "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
