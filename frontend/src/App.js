import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import LogIn from "./pages/login";
import SignUp from "./pages/signup";
import Home from "./pages/home";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

function App() {

  const [cookie, setCookie] = useCookies()


  return (
    <div className="App font-poppins">
      <Router>
        {
          cookie.token ? 
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/home"/>} />
        </Routes> :
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login"/>} />
        </Routes>
        } 
      </Router>
    </div>
  );
}


export default App;
