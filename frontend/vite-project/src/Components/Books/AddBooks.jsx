import axios from "axios";
import { useState } from "react";

const AddBooks = () => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    publishedDate: "",
    summary: "",
    bookImage: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBookData({ ...bookData, bookImage: file });
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formDataToSend = new FormData();
      Object.entries(bookData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/book/addBook`,
        formDataToSend,
        { withCredentials: true }
      );

      setMessage("✅ Book added successfully!");
      setBookData({
        title: "",
        author: "",
        genre: "",
        publishedDate: "",
        summary: "",
        bookImage: null,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Error adding book:", error);
      setMessage("❌ Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-12">
      <div className="bg-white shadow-xl rounded-lg p-16 w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">📖 Add a New Book</h2>

        {message && (
          <div className={`text-center font-medium p-4 rounded-md mb-8 text-sm ${
            message.includes("✅") ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 p-4">Title</label>
            <input
              type="text"
              name="title"
              value={bookData.title}
              onChange={handleInputChange}
              placeholder="Enter Book Title"
              required
              className="w-full  border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 p-4"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Author</label>
            <input
              type="text"
              name="author"
              value={bookData.author}
              onChange={handleInputChange}
              placeholder="Enter Author Name"
              required
              className="w-full p-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Genre</label>
            <input
              type="text"
              name="genre"
              value={bookData.genre}
              onChange={handleInputChange}
              placeholder="Enter Genre"
              className="w-full p-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Published Date</label>
            <input
              type="date"
              name="publishedDate"
              value={bookData.publishedDate}
              onChange={handleInputChange}
              className="w-full p-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Summary</label>
            <textarea
              name="summary"
              value={bookData.summary}
              onChange={handleInputChange}
              rows="4"
              placeholder="Write a brief summary of the book..."
              className="w-full p-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Book Image</label>
            <input
              type="file"
              name="bookImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-6 rounded-lg bg-white cursor-pointer file:mr-4 file:py-3 file:px-5 file:border-0 file:bg-blue-600 file:text-white file:rounded-md hover:file:bg-blue-700 transition-all duration-200"
            />
            {previewImage && (
              <div className="mt-6 flex justify-center">
                <img src={previewImage} alt="Preview" className="h-48 rounded-lg border object-cover shadow-lg" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-6 rounded-lg text-white font-semibold transition-all duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Submitting..." : "➕ Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBooks;
