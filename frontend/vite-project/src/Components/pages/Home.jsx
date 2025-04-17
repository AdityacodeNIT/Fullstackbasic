import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import UserContext from "../../context/UserContext.jsx";

const Home = () => {
  const { averageRatings = {}, fetchAllAverageRatings, fetchBook } = useContext(UserContext);
  const [booksData, setBooksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/book/getBooks`
        );
        const books = Array.isArray(response.data) ? response.data : [];
        setBooksData(books);

        const ids = books.map((book) => book._id);
        fetchAllAverageRatings(ids);
      } catch (err) {
        setError("Failed to load books. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [fetchAllAverageRatings]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-10">

        {/* Hero Section */}
        <div className="text-center py-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-3">
            Welcome to BookVerse 📚
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Discover and review your favorite books. Explore stories from all genres and share your thoughts with others!
          </p>
        </div>

        {/* Featured Books Heading */}
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10 underline decoration-green-300">
          Featured Books
        </h2>

        {/* Loading / Error / Empty States */}
        {isLoading ? (
          <p className="text-center text-gray-600 text-lg">Loading books...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : booksData.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No books available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {booksData.map((book) => {
              const rating = averageRatings[book._id]?.toFixed(1) || "N/A";
              return (
                <div
                  key={book._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
                >
                  <Link to="/about" className="block" onClick={() => fetchBook(book._id)}>
                    {/* Book Cover */}
                    <div className="overflow-hidden rounded-t-xl h-64 bg-gray-200">
                      <img
                        src={book.bookImage || "/placeholder.png"}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-600 italic">{book.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-yellow-500 font-semibold">⭐ {rating}</span>
                        <span className="text-sm text-gray-500 bg-green-50 px-2 py-0.5 rounded">
                          {book.genre}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
