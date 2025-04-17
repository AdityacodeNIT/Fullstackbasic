import { useState, useEffect ,useMemo} from "react";
import UserContext from "./UserContext";
import axios from "axios";



const UserContextProvider = ({ children }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const getBookDetail = (detail) => setBookDetails(detail);

  const [quantity, setQuantity] = useState(1);

  const [book, setBook] = useState(
    JSON.parse(localStorage.getItem("book")) || null
  );

  const fetchBook = async (id) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/book/getBook/${id}`
      );

      setBook(res.data);
      setBookId(res.data._id); // ✅ Set bookId when book is fetched
    } catch (err) {
      console.error("Failed to fetch book:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("book", JSON.stringify(book));
  }, [book,setBook]);

  const [userDetail, setUserDetail] = useState(
    JSON.parse(localStorage.getItem("details")) || null
  );
  const getUserDetail = async (details) => {
    if (details) {
      setUserDetail(details);
    } else {
      console.error("Invalid details passed to getUserDetail");
    }
  };

  useEffect(() => {
    localStorage.setItem("details", JSON.stringify(userDetail));
  }, [userDetail]);

  const [review, setReview] = useState({
    rating: 0,
    description: "",
    BookId: "",
  });
  const [BookId, setBookId] = useState(null);

  const [averageRatings, setAverageRatings] = useState({});
  const [totalRatings, setTotalRatings] = useState({}); // ✅ Added state for total ratings

  const handleReviewSubmit = async () => {
    if (!review.rating || !review.description) return;

    const payload = {
      rating: review.rating,
      description: review.description,
      BookId: book?._id || review.BookId, // ensure it uses the actual book ID
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v2/feedback/review`,
        payload,
        {withCredentials:true}
      );
      setReview({ rating: 0, description: "" });
    } catch (error) {
      console.error("There was an error posting the review!", error);
    }
  };

  const fetchAllAverageRatings = async (bookIds) => {
    try {
      const responses = await Promise.all(
        bookIds.map(async (id) => {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v2/feedback/average`,
            { BookId: id }
          );
          return {
            id,
            avg: response.data.averageRating || 0,
            total: response.data.count || 0,
          };
        })
      );
  
      const avgMap = {};
      const totalMap = {};
  
      responses.forEach(({ id, avg, total }) => {
        avgMap[id] = avg;
        totalMap[id] = total;
      });
  
      setAverageRatings(avgMap);
      setTotalRatings(totalMap);
    } catch (err) {
      console.error("Error fetching all average ratings:", err);
    }
  };
  

  const [gotReview, setGotReview] = useState(null);

  const reviewsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const getReview = async (bookId) => {
    if (!bookId) return;
    
    // Clear old reviews immediately
    setGotReview([]);
    setCurrentPage(1); // Reset to the first page when fetching new reviews 
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v2/feedback/getReview/${bookId}`);
      setGotReview(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };
  


  const indexOfLastReview = useMemo(
    () => currentPage * reviewsPerPage,
    [currentPage]
  );
  const indexOfFirstReview = useMemo(
    () => indexOfLastReview - reviewsPerPage,
    [indexOfLastReview]
  );
  const currentReviews = useMemo(
    () => (gotReview || []).slice(indexOfFirstReview, indexOfLastReview),
    [gotReview, indexOfFirstReview, indexOfLastReview]
  );
  const totalPages = useMemo(
    () => Math.ceil((gotReview || []).length / reviewsPerPage),
    [gotReview]
  );


 


  return (
    <UserContext.Provider
      value={{
        userDetail,
        setUserDetail,
        getUserDetail,
        quantity,
        setQuantity,
        getReview,
        gotReview,
        bookDetails,
        getBookDetail,
        review,
        setReview,
        handleReviewSubmit,
        BookId,
        setBookId,
        totalRatings, // ✅ Exposed in context
        averageRatings,
        fetchBook,
        book,
      setGotReview,
        fetchAllAverageRatings,
        currentPage,
        totalPages,
        setCurrentPage,
        currentReviews,
      
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
