import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi"; // Import the loader icon

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false); // State to handle loading

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // Set loading to true when the form is submitted

        // Construct the data to be sent
        const data = {
            fullName: formData.fullName,
            email: formData.email,
            username: formData.username,
            password: formData.password,
        };

        try {
            // Send the registration request as JSON
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/users/register`,
                data,
                { withCredentials: true }
            );

            // Check if registration is successful
            if (response.status >= 200 && response.status < 300) {
                navigate("/userLogin"); // Redirect to login page after successful registration
            }
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Left section - Register form */}
            <div className="flex flex-col justify-center items-center p-4">
                <div className="w-1/3 p-8 shadow-xl rounded-lg border border-white-300">
                    <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
                        Register
                    </h1>
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="mb-4 p-2 w-full border-2 border-rose-400 rounded-md transition duration-200 focus:outline-none focus:border-gray-800"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mb-4 p-2 w-full border-2 border-rose-400 rounded-md transition duration-200 focus:outline-none focus:border-gray-800"
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="mb-4 p-2 w-full border-2 border-rose-400 rounded-md transition duration-200 focus:outline-none focus:border-gray-800"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="mb-4 p-2 w-full border-2 border-rose-400 rounded-md transition duration-200 focus:outline-none focus:border-gray-800"
                        />
                        <button
                            type="submit"
                            className="w-full p-2.5 bg-gray-800 text-white font-bold rounded-md transition duration-200"
                            disabled={loading} // Disable the button while loading
                        >
                            {loading ? (
                                <FiLoader className="animate-spin mr-2 inline" /> // Spinner icon
                            ) : (
                                "Register"
                            )}
                        </button>
                        <p className="mt-4 text-center">
                            Already a user?{" "}
                            <Link to="/userLogin" className="text-blue-400">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
