import { FaSpotify } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineDownloadForOffline } from "react-icons/md";

const Navbar = () => {

    const location = useLocation()

    return (
        <div className="bg-black w-full sticky top-0 flex text-white items-center px-6 py-2 justify-evenly h-[60px]">
           <div className="text-4xl flex justify-start w-[10%] ml-0"><FaSpotify/></div> 
           <div className="flex gap-2 w-[60%] flex-grow justify-center ml-40 h-full">
                <Link to="/home" className={`text-3xl p-2 w-fit rounded-full h-full ${location.pathname === "/home" ? "bg-white bg-opacity-15" : "bg-white bg-opacity-5"} hover:bg-white hover:bg-opacity-15 transition-all flex justify-items-center`}>
                        <GoHomeFill />
                </Link>
                <div className="relative w-[80%] group h-[100%]">
                    <button className="absolute left-3 top-2 text-white text-opacity-40 text-3xl font-semibold
                    hover:scale-110 hover:text-white transition group-hover:text-white w-fit h-fit">
                        <IoIosSearch />
                    </button>
                    <input className="w-[85%] px-12 bg-white bg-opacity-15 hover:bg-opacity-20 focus:bg-opacity-20  border-white border-opacity-25 rounded-full h-[100%] transition hover:border-white"
                    placeholder="What do you want to play?"
                    >
                    </input>
                </div>
                
           </div>
           <div className="flex items-center w-[20%] gap-4 justify-end">
                    <div className="text-xs w-fit flex items-center justify-between font-semibold"><div className="text-xl mr-1"><MdOutlineDownloadForOffline /></div>Install App</div>
                    <Link to={"/profile"} className="w-8 h-full text-2xl bg-pink-300 rounded-full flex items-center text-black justify-center font-semibold">A</Link> 
            </div>
        </div>
    );
}
 
export default Navbar;