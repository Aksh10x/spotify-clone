import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthenticatedDELETEReq, AuthenticatedGETReq } from "../utils/server.helpers";
import { PiMusicNotesSimple } from "react-icons/pi";
import { IoIosPlay} from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import HorizontalCard from "../components/songHorizontalCard";
import { WiTime3 } from "react-icons/wi";
import { LuCircleMinus } from "react-icons/lu";
import { PlaylistContext } from "../utils/playlistContext";
import { SearchContext } from "../utils/searchContext";
import { SearchPage } from "../components/search_Page";
import { SongContext } from "../utils/songContext";

const Playlist = () => {
    const {playlistId} = useParams()
    const [thumbnail, setThumbnail] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [songNumber, setSongNumber] = useState(0)
    const [songs, setSongs] = useState([])
    const [deletePopUp, setDeletePopUp] = useState(false)
    const [owner, setOwner] = useState("")
    const [ownerId, setOwnerId] = useState("")
    const menuRef = useRef(null)
    const navigate = useNavigate()
    const {inSearch, setInSearch} = useContext(SearchContext)
    const [userId, setUserId] = useState("")
    const {
        playingId, setPlayingId,
        songName, setSongName,
        songThumbnail, setSongThumbnail,
        songTrack,setSongTrack,
        isPlaying, setIsPlaying,
        artist, setArtist,
        queue, setQueue,
        currentIndex, setCurrentIndex,
    } = useContext(SongContext)

    const {deleted, setDeleted} = useContext(PlaylistContext)

    async function userIdFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        setUserId(res.data._id)
    }

    const fetchData = async() => {
        const res = await AuthenticatedGETReq(`/playlist/get-playlist/${playlistId}`)
        console.log(res)
        if(res.success){
            setThumbnail(res.data?.playlist[0].thumbnail)
            setName(res.data?.playlist[0].name)
            setDescription(res.data?.playlist[0].description)
            setSongNumber(res.data?.playlist[0]?.songs.length)
            setOwnerId(res.data?.playlist[0].owner)
            setSongs(res.data?.playlist[0].songs)
            setOwner(res.data?.ownerName)
        }else{
            alert("Error loading playlist.")
        }
    }

    useEffect(() => {
        const handleMouseClick = (event) => {
            if(menuRef.current && !menuRef.current.contains(event.target)){
                setDeletePopUp(false)
            }
        }

        if(deletePopUp){
            document.addEventListener("mousedown", handleMouseClick)
        }

        return () => {
            document.removeEventListener("mousedown",handleMouseClick)
        }
    },[deletePopUp])

    const deletePlaylist = async() => {
        const res = await AuthenticatedDELETEReq(`/playlist/delete-playlist/${playlistId}`)

        if(res.success){
            setDeleted((prev) => !prev)
            navigate("/home")
        }
    }

    useEffect(() => {
        fetchData()
        userIdFetch()
    },[playlistId])
    return (
        <div className="absolute right-0 lg:w-[75.5%] md:w-[75%] sm:w-[75%] 2xl:w-[82%] h-[calc(100%-75px)] flex justify-center bg-white/5 overflow-hidden">
            <div className="w-full h-[calc(100vh-68px)] max-w-[1500px] text-black bg-black relative pt-0 flex gap-2">
                <div className="w-full h-[calc(100%-75px)] bg-white bg-opacity-5 rounded-lg flex gap-2 flex-col overflow-y-auto custom-scrollbar relative">

                    
                    {
                        inSearch ? 
                        <div className="p-6"><SearchPage/></div>
                        :
                        <>
                        <div className="w-full bg-gradient-to-b rounded-t-lg from-white/40 to-white/10  px-5 pb-3 pt-6 flex justify-end flex-col">
                    
                            <div className="w-full flex pb-2">
                                
                                <div className="h-full flex items-end">
                                {thumbnail ? 
                                    <div className="h-36 w-36 bg-pink-300 rounded-md shadow-xl flex justify-center items-center text-5xl font-semibold">
                                        <img src={thumbnail} className="h-full w-36 rounded-md object-cover object-center"/>
                                    </div>
                                    :
                                    <div className="h-36 w-36 text-7xl bg-black/50 rounded-md shadow-xl flex justify-center items-center font-semibold text-white/60">
                                        <PiMusicNotesSimple />
                                    </div>
                                }
                                </div>


                                
                                <div className="px-8 flex flex-col justify-end gap-2 max-w-[calc(100%-200px)]">
                                    <div className="text-white text-sm">Playlist</div>
                                    <div className="text-white font-bold text-4xl max-w-full overflow-hidden break-all">
                                        {name}
                                    </div>
                                    <div className="text-white text-opacity-40 text-sm">{description}</div>
                                    <div className="flex gap-1 items-center">
                                        <p className="text-white text-xs font-semibold">{owner}</p>
                                        <p className="text-sm text-white/40">•</p>
                                        <p className="text-sm text-white/40">{songNumber} Songs</p>
                                    </div>
                                </div>


                            </div>
                        </div>


                        <div className="flex min-h-[80px] w-full items-center px-4 gap-6">
                            <button onClick={() => {if(songs.length > 0){
                                setSongTrack(songs[0].track)
                                setPlayingId(songs[0]._id)
                                setSongName(songs[0].name)
                                setSongThumbnail(songs[0].thumbnail)
                                setArtist(songs[0].artistFirstName + " " + songs[0].artistSecondName)
                                setIsPlaying(true)
                                setQueue(songs)
                                setCurrentIndex(0)
                                }}} className="text-4xl w-14 h-14 flex justify-center items-center bg-green-500 text-gray-950 rounded-full shadow-xl pl-1 hover:scale-105 transition-all cursor-pointer hover:bg-green-400"><IoIosPlay /></button>
                            {
                                ownerId === userId && 
                                <button onClick={() => setDeletePopUp((prev) => !prev)} className="text-white/60 relative text-2xl transition-all cursor-pointer group"><div className="group-hover:scale-105 group-hover:text-white"><BsThreeDots/></div>
                                {deletePopUp && 
                                (<div ref={menuRef} className="absolute left-8 top-[-5px] bg-black min-w-[160px] rounded-sm shadow-xl">
                                    <div className="w-full h-full bg-white/15 flex flex-col items-start rounded-sm shadow-xl">
                                        <button onClick={deletePlaylist} className="text-sm text-white flex rounded-xs hover:bg-white/5 transition-all w-full p-2"><div className="text-lg mr-1 flex items-center justify-center"><LuCircleMinus /></div> Delete Playlist</button>
                                    </div>
                                </div>
                                )}
                                </button>
                            }
                        </div>

                        <div className="px-4 text-white/60 flex flex-col items-center">
                            {songs.length!=0 && 
                                <div className="flex w-full text-sm items-center">
                                    <div className="w-[5%] flex justify-center ml-2">#</div>
                                    <div className="w-10">Title</div>
                                    <div className="flex flex-col ml-4 flex-grow"></div>
                                    <div className="w-[25%]">Artist</div>
                                    <div className="w-[15%] flex justify-center pr-16 text-xl mb-1"><WiTime3 /></div>
                                </div>
                            }
                            <div className="w-full bg-white/15 h-[0.8px] "></div>
                            {songs && songs.length > 0 ? 
                                songs?.map((song, index) => (
                                    <HorizontalCard 
                                    songId={song._id}
                                    name={song.name} 
                                    artistFirstName={song.artistFirstName}
                                    artistSecondName={song.artistSecondName}
                                    thumbnail={song.thumbnail}
                                    trackUrl={song.track}
                                    index={index}
                                    queueGiven={songs}
                                    />
                                ))
                                :
                                <div className="text-sm text-white/50 mt-12">Fill up your playlist with your favourite songs!</div>
                            }
                        </div>
                    </>
                    }
                    

                </div>
            </div>
        
        </div>
    );
}
 
export default Playlist;