import { Link, useSearchParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import UserContext from "../../context/UserContext.jsx";
import Lottie from "lottie-react";
import bookLoader from "../../assets/bookloaderanimation.json";
import { FaSearch } from "react-icons/fa";

const Home = () => {
  const { averageRatings = {}, fetchAllAverageRatings, fetchBook } = useContext(UserContext);
  const [booksData, setBooksData] = useState([]);
  const [featuredBooksData, setFeaturedBooksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [error, setError] = useState(null);

  

  const [searchQuery, setSearchQuery] = useState("");
 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/book/getBooks`);
        const books = Array.isArray(response.data.data) ? response.data.data : [];
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

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/book/featuredBooks`);
        setFeaturedBooksData(response.data.data);
      } catch (err) {
        setError("Failed to load featured books. Please try again.");
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);



  const filteredBooks = booksData.filter((book) => {
    const matchesSearchQuery =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearchQuery;
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="text-center py-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-3">
            Welcome to BookVerse 📚
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Discover and review your favorite books. Explore stories from all genres and share your thoughts with others!
          </p>
        </div>

        <h2 className="text-3xl font-bold text-green-800 text-center mb-10 underline decoration-green-300">
          Featured Books
        </h2>

        {isFeaturedLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Lottie animationData={bookLoader} loop={true} className="w-40 h-40" />
            <p className="text-gray-600 mt-4 text-lg">Finding the best reads for you...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : featuredBooksData.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No featured books available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredBooksData.map((book) => {
              const rating = averageRatings[book._id]?.toFixed(1) || "N/A";
              return (
                <div
                  key={book._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
                >
                  <Link to="/about" className="block" onClick={() => fetchBook(book._id)}>
                    <div className="overflow-hidden rounded-t-xl h-64 bg-gray-200">
                      <img
                        src={book.bookImage || "/placeholder.png"}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
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

        <div className="flex justify-center gap-6 mb-10 mt-10">
          <div className="relative w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search books by title, author or genre..."
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 w-full"
            />
            <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-green-800 text-center mb-10 mt-20 underline decoration-green-300">
          All Books
        </h2>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Lottie animationData={bookLoader} loop={true} className="w-40 h-40" />
            <p className="text-gray-600 mt-4 text-lg">Finding your next great read...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No books available.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredBooks.slice(0, 8).map((book) => {
                const rating = averageRatings[book._id]?.toFixed(1) || "N/A";
                return (
                  <div
                    key={book._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
                  >
                    <Link to="/about" className="block" onClick={() => fetchBook(book._id)}>
                      <div className="overflow-hidden rounded-t-xl h-64 bg-gray-200">
                        <img
                          src={book.bookImage || "/placeholder.png"}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
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

            {filteredBooks.length > 4 && (
              <div className="text-center mb-10 mt-6">
                <Link
                  to="/Allbooks"
                  className="text-lg font-semibold text-green-700 hover:underline"
                >
                  See More Books
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
