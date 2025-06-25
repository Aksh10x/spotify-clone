import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import LogIn from "./pages/login";
import SignUp from "./pages/signup";
import Home from "./pages/home";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Profile from "./pages/profile";
import Upload from "./pages/uploadSong";
import { SongProvider } from "./utils/songContext";
import Playback from "./components/playback";
import Playlist from "./pages/playlist";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import { PlaylistProvider } from "./utils/playlistContext";
import { SearchProvider } from "./utils/searchContext";
import OtherProfile from "./pages/otherProfile";
import { FaSpotify } from "react-icons/fa";

function App() {
  const [cookie] = useCookies(["token"]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() =>{
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  },[]);

  if(isMobile){
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 text-white text-3xl">
          <FaSpotify />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-green-500">Desktop Experience Only</h1>
        <p className="text-white/50 mb-6">
          This application is optimized for desktop viewing. Please access from a computer for the best experience.
        </p>
        <div className="border-t border-gray-800 w-16 mx-auto pt-6 min-w-full">
          <p className="text-gray-600 text-sm">Thank you for understanding!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App font-poppins bg-black h-screen w-full overflow-hidden scrollbar-hide">
      <SearchProvider>
      <SongProvider>
      <PlaylistProvider>
      
        
      <Router>
        <NavProvider/>
        
        {cookie.token ? 
        <>
        <Navbar/>
        <Sidebar/>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/uploadSong" element={<Upload/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="*" element={<Navigate to={"/signup"} />} />
          <Route path="/playlist/:playlistId" element={<Playlist/>}/>
          <Route path="/profile/:userId" element={<OtherProfile/>}/>
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
          <Route path="/playlist/:playlistId" element={<Playlist/>}/>
          <Route path="*" element={<Navigate to={"/signup"} />} />
        </Routes> 
        </>
        }
      </Router>
       
      </PlaylistProvider>  
      </SongProvider>
      </SearchProvider> 
    </div>
  );
}

const NavProvider = () =>{
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
  },[location.pathname, cookie.token, navigate]);

  return null;
}

export default App;