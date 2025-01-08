import { FaSpotify } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { useEffect, useState } from "react";
import { AuthenticatedGETReq } from "../utils/server.helpers";
import { useCookies } from "react-cookie";

const Navbar = () => {

    const [logo, setLogo] = useState("")
    const [cookie,setCookie,removeCookie] = useCookies(["token"])

    const navigate = useNavigate()

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        console.log(res)
        const first = res?.data?.firstName?.[0]
        const second = res?.data?.secondName?.[0] || ""
        setLogo(`${first}${second}`)
    }

    //get all details
    useEffect(() => {
        DataFetch()
    },[]) 

    const location = useLocation()

    const delCookie = () => {
        removeCookie("token")
        window.location.reload()
        navigate("/signup")
    }

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
                    <button className="text-black font-semibold bg-white px-3 py-2 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-sm"
                    onClick={delCookie}
                    >Logout</button>
                    <Link to={"/profile"} className="w-[35px] h-[35px] text-xl bg-pink-300 rounded-full flex items-center text-black justify-center font-semibold">{logo}

                    </Link> 
            </div>
        </div>
    );
}
 
export default Navbar;