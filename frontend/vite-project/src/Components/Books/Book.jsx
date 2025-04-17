import { useContext, useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import UserContext from "../../context/UserContext";
import axios from "axios"

const Book = () => {
  const {
    book,
    review,
    setReview,
    handleReviewSubmit,
    averageRatings,
    totalRatings,
    getReview,
    fetchAllAverageRatings,
    currentPage,
    totalPages,
    setCurrentPage,
    currentReviews,
    setGotReview, // Ensure you can set the reviews directly
  } = useContext(UserContext);

  // State to handle loading reviews
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!book?._id) return;
    const controller = new AbortController();
    const signal = controller.signal;
  
    setGotReview([]);         // clear immediately
    setIsLoading(true);
    setCurrentPage(1);
  
    fetchAllAverageRatings([book._id]); // you can also cancel these if needed
  
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/v2/feedback/getReview/${book._id}`,
        { signal }
      )
      .then((res) => setGotReview(res.data))
      .catch((err) => {
        if (err.name !== "CanceledError") console.error(err);
        else console.log("Previous request canceled");
      })
      .finally(() => setIsLoading(false));
  
    return () => {
      // runs when book._id changes or component unmounts
      controller.abort();
    };
  }, [book?._id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleReviewSubmit();
    fetchAllAverageRatings([book._id]); // Re-fetch average ratings after review submission
    getReview(book._id); // Re-fetch reviews to include the newly submitted review
  };

  const avgRating = averageRatings[book?._id] || 0;
  const totalRating = totalRatings[book?._id] || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {book && (
        <>
          {/* Book Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex items-start space-x-6">
            <img
              src={book.bookImage} // Ensure this URL is available in your book data
              alt={book.title}
              className="w-32 h-48 object-cover rounded-md shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-gray-500 text-lg">by {book.author}</p>
              <p className="text-gray-700 mt-4">{book.summary}</p>
            </div>
          </div>

          {/* Rating Display */}
          <div className="bg-gray-100 rounded-lg shadow p-4 flex justify-between items-center mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl ${i + 1 <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-2 text-gray-800 font-medium text-lg">{avgRating.toFixed(1)} / 5</span>
            </div>
            <div className="text-gray-600">{totalRating} review{totalRating !== 1 ? "s" : ""}</div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Write a Review</h2>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({ ...review, rating: star, BookId: book._id })}
                  className={`text-2xl transition-all duration-200 ${star <= review.rating ? "text-yellow-500" : "text-gray-300"} hover:scale-125`}
                >
                  <FaStar />
                </button>
              ))}
            </div>

            <textarea
              value={review.description}
              onChange={(e) => setReview({ ...review, description: e.target.value })}
              placeholder="Write your review here..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <button
              type="submit"
              disabled={!review.rating || !review.description}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
            >
              Submit Review
            </button>
          </form>
        </>
      )}

      {/* Reviews Section */}
      <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">Reviews</h3>
      {isLoading ? (
        <div className="text-gray-600 text-center mt-4">Loading reviews...</div>
      ) : currentReviews?.length ? (
        <div className="space-y-4">
         
          {currentReviews.map((rev, i) => (
            
            <div key={i} className="bg-gray-100 rounded-lg shadow p-4 text-gray-800">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span className="font-medium">{rev.userId?.fullName || "Anonymous"}</span>
                <span>{new Date(rev.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</span>
              </div>
              <div className="flex mt-2">
                {[...Array(rev.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 mr-1" />
                ))}
              </div>
              <p className="mt-2">{rev.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600 text-center mt-4">No reviews yet.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            ⬅ Previous
          </button>

          <span className="text-gray-800 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default Book;
