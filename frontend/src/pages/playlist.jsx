import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { AuthenticatedGETReq } from "../utils/server.helpers";
import { PiMusicNotesSimple } from "react-icons/pi";

const Playlist = () => {
    const {playlistId} = useParams()
    const [thumbnail, setThumbnail] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [songNumber, setSongNumber] = useState(0)

    const fetchData = async() => {
        const res = await AuthenticatedGETReq(`/playlist/get-playlist/${playlistId}`)
        console.log(res)
        if(res.success){
            setThumbnail(res.data?.[0].thumbnail)
            setName(res.data?.[0].name)
            setDescription(res.data?.[0].description)
            setSongNumber(res.data?.[0].songs.length)
        }else{
            alert("Error loading playlist.")
        }
    }

    useEffect(() => {
        fetchData()
    },[playlistId])
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Navbar/>
            <div className="w-full h-[calc(100vh-60px)] text-black bg-black relative p-2 pt-0 flex gap-2">
                <Sidebar/>
                <div className="w-full h-[calc(100%-75px)] bg-white bg-opacity-5 rounded-lg flex gap-2 flex-col">
                    <div className="w-full bg-gradient-to-b from-white/40 to-white/10 min-h-[200px] max-h-[300px] px-5 pb-3 pt-6 flex justify-end flex-col">
                        <div className="w-full flex pb-2">
                            
                            
                            {thumbnail ? 
                                <div className="h-36 w-36 bg-pink-300 rounded-md shadow-xl flex justify-center items-center text-5xl font-semibold">
                                    <img src={thumbnail} className="h-full w-36 rounded-md"/>
                                </div>
                                :
                                <div className="h-36 w-36 text-7xl bg-black/50 rounded-md shadow-xl flex justify-center items-center font-semibold text-white/60">
                                    <PiMusicNotesSimple />
                                </div>
                            }
                            <div className="px-8 flex flex-col justify-start gap-2 max-w-[calc(100%-200px)]">
                                <div className="text-white text-sm">Playlist</div>
                                <div className="font-bold text-white flex gap-3 justify-center mr-auto text-4xl break-words text-ellipsis">{name}</div>
                                <div className="text-white text-opacity-40 text-sm">{description}</div>
                                <div className="flex gap-1 items-center">
                                    <p className="text-white text-xs font-semibold">Akshath Surwase</p>
                                    <p className="text-sm text-white/40">•</p>
                                    <p className="text-sm text-white/40">{songNumber} Songs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        
        </div>
    );
}
 
export default Playlist;