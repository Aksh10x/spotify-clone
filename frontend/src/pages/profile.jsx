import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { AuthenticatedGETReq, AuthenticatedPATCHReq } from "../utils/server.helpers.js";
import { Link } from "react-router-dom";

const Profile = () => {

    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [username,setUsername] = useState("")
    const [isArtist, setIsArtist] = useState(null)

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        console.log(res)
        setFirstName(res.data.firstName)
        setSecondName(res.data.secondName)
        setUsername(res.data.username)
        setIsArtist(res.data.isArtist)
    }

    //get all details
    useEffect(() => {
        DataFetch()
    },[isArtist]) 


    const toggleArtist = async() => {
        const res = await AuthenticatedPATCHReq("/user/toggle-artist")
        setIsArtist((prev) => !prev)
        console.log(res)
    }



    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Navbar/>
            <div className="w-full h-[calc(100vh-60px)] text-black bg-black relative p-2 pt-0 flex gap-2">
                <Sidebar/>
                <div className="w-full h-[100%] bg-white bg-opacity-10 rounded-lg flex gap-2 flex-col overflow-y-auto scrollbar-hide">
                    <div className="w-full bg-gradient-to-b from-white/25 to-white/5 min-h-[280px] px-6 py-3 flex justify-end flex-col">
                        <div className="w-full flex pb-4 ">
                            <div className="h-32 w-32 rounded-full bg-pink-300 shadow-xl flex justify-center items-center text-5xl font-semibold">
                                {firstName[0] + secondName[0]}
                            </div>
                            <div className="px-8 flex flex-col justify-start">
                                <div className="text-white">Profile</div>
                                <div className="text-4xl font-bold text-white">{firstName + " " + secondName}</div>
                                <div className="text-white text-opacity-35 font-semibold text-sm">@{username}</div>
                                <button className="mr-auto mt-4 text-black font-semibold bg-white px-4 py-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105"
                                onClick={() => {toggleArtist()}}
                                >{isArtist ? <p>Delete Artist</p> : <p>Become an Artist</p>}</button> {/*add popup for pfp and confirm delete*/}
                            </div>
                        </div>
                    </div>
                    {isArtist && 
                        <div className="p-6 min-h-[200px]">
                            <div className="text-white font-semibold text-3xl">Your Songs</div> {/*No songs? upload first one now ts*/}
                            <div className="mt-6">
                                <Link className="mr-auto text-black font-semibold bg-white px-4 py-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105"
                                to={"/uploadSong"}
                                >
                                    Upload a song
                                </Link>
                            </div>
                        </div>
                    }

                    <div className="text-white p-6 font-bold text-3xl w-full min-h-[800px]">
                        Your Library
                    </div>

                </div>
            </div>
        
        </div>
    );
}
 
export default Profile;