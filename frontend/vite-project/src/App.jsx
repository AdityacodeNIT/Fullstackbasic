import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Register from "./Components/User/Register.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import Userlogin from "./Components/User/Userlogin.jsx";
import UserDetails from "./Components/User/UserDetails.jsx";
import Logout from "./Components/User/Logout.jsx";



import UpdateUserAccountDetails from "./Components/User/UpdateUserAccountDetails.jsx";
import ChangePassword from "./Components/User/changePassword.jsx";
import UpdateDetails from "./Components/User/UpdateDetails.jsx";

import AddBooks from "./Components/Books/AddBooks.jsx";
import Book from "./Components/Books/Book.jsx";
import Home from "./Components/pages/Home.jsx";
import Navbar from "./Components/pages/Navbar.jsx";
import AllBooks from "./Components/Books/AllBooks.jsx";



function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
    
     <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<Book/>} />

 ]
          <Route path="/register" element={<Register />} />
          <Route path="/userLogin" element={<Userlogin />} />
          <Route path="/user" element={<UserDetails />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/changePassword" element={<ChangePassword />} />
         



          <Route path="/AddBooks" element={<AddBooks />} />
          <Route path="/AllBooks" element={<AllBooks />} />
       ]
        
   
          <Route path="/changeDetails" element={<UpdateUserAccountDetails />} />
          <Route path="/updateDetails" element={<UpdateDetails />} />
  ]

        </Routes>
     
 
      
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
