import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import LogIn from "./pages/login";
import SignUp from "./pages/signup";
import Home from "./pages/home";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import Profile from "./pages/profile";
import Upload from "./pages/uploadSong";
import { SongProvider } from "./utils/songContext";
import Playback from "./components/playback";

function App() {

  const [cookie] = useCookies(["token"])

  return (
    <div className="App font-poppins">
      <SongProvider>
      <Router>
        <NavProvider/>
        {cookie.token ? 
        <>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/uploadSong" element={<Upload/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="*" element={<Navigate to={"/signup"} />} />
        </Routes> 
        <Playback/>
        </>
        :
        <>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/uploadSong" element={<Upload/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="*" element={<Navigate to={"/signup"} />} />
        </Routes> 
        </>
        }
      </Router>
      </SongProvider>
    </div>
  );
}

const NavProvider = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [cookie] = useCookies(["token"])

  useEffect(() => {
    if (
      ( location.pathname === "/signup" || 
        location.pathname === "/login" || 
        location.pathname === "/") && cookie.token
    ) {
      navigate("/home");
    }

    if(!cookie.token &&
      
      !(location.pathname === "/signup" || 
      location.pathname === "/login" || 
      location.pathname === "/")

    ){
      navigate("/signup")
    }
  }, [location.pathname, cookie.token, navigate]);

  return null;
}

export default App;
