
const About = () => {
  return (
    <div className="min-h-screen px-6 py-16 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-green-700">📚 About BookVerse</h1>
        <p className="text-lg text-gray-600 mb-8">
          <strong>BookVerse</strong> is a modern book review platform that allows users to explore books, share their thoughts,
          rate reads, and discover trending titles. Whether you're a casual reader or a hardcore bibliophile,
          BookVerse provides a clean, community-powered experience.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 text-left mt-12">
          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-green-700 mb-2">🔍 Discover Books</h2>
            <p className="text-sm text-gray-600">
              Browse featured books, search by title, and filter by genre — all in a beautifully responsive layout.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-yellow-600 mb-2">✍️ Write & Read Reviews</h2>
            <p className="text-sm text-gray-600">
              Read honest reviews from fellow users and share your own. Every voice counts!
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">👤 User Profiles</h2>
            <p className="text-sm text-gray-600">
              Manage your reviews, track your rated books, and update profile info with ease.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-red-600 mb-2">🛠 Admin Features</h2>
            <p className="text-sm text-gray-600">
              Admins can add books.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-green-700 mb-4">🚀 Tech Stack</h3>
          <ul className="text-gray-600 text-sm space-y-2">
            <li><strong>Frontend:</strong> React, Tailwind CSS, React Router, Context API</li>
            <li><strong>Backend:</strong> Node.js, Express.js</li>
            <li><strong>Database:</strong> MongoDB (Mongoose ORM)</li>
            <li><strong>Auth:</strong> JWT-based authentication for both admin and users</li>
          </ul>
        </div>

      
      </div>
    </div>
  );
};

export default About;
