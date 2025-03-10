import { useContext, useEffect, useState } from "react";
import { AuthenticatedGETReq, AuthenticatedPATCHReq, AuthenticatedPOSTReq, getAudioDurationFromURL } from "../utils/server.helpers";
import { IoIosPlay } from "react-icons/io";
import { SongContext } from "../utils/songContext";
import { FaCheck} from "react-icons/fa6";
import { BiPlusCircle } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { PiMusicNotesSimple } from "react-icons/pi";
import { LuLoaderCircle } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";


const HorizontalCard = ({songId,index,thumbnail,name,artistFirstName,artistSecondName,trackUrl}) => {

    const [duration, setDuration] = useState("");
    const [addSong,setAddSong] = useState(false);
    const [playlists, setPlaylists] = useState([])
    const [id,setId] = useState("")
    const [songToAdd,setSongToAdd] = useState("")
    const [playlistsSelected,setPlaylistsSelected] = useState([])
    const [playlistError,setPlaylistError] = useState("")
    const [loading,setLoading] = useState(false)
    const [toast, setToast] = useState("")
    const [songInPlaylist, setSongInPlaylist] = useState([])
    const location = useLocation()

    const {
        songName, setSongName,
        songThumbnail, setSongThumbnail,
        songTrack,setSongTrack,
        isPlaying, setIsPlaying,
        artist, setArtist,
    } = useContext(SongContext)

    const fetchDuration = async () => {
        try {
          const durationInSeconds = await getAudioDurationFromURL(trackUrl);
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = Math.floor(durationInSeconds % 60);
          setDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        } catch (error) {
          console.error(error);
          setDuration("N/A");
        }
    };

    useEffect(() => {
        if (trackUrl) {
          fetchDuration();
        }
    }, [trackUrl]);

    const playSong = (name,thumbnail,trackUrl,artistFirstName,artistSecondName) => {
        setSongName(name)
        setSongThumbnail(thumbnail)
        setSongTrack(trackUrl)
        setArtist(artistFirstName + " " + artistSecondName)

    }

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        setId(res.data._id)
    }

    const fetchPlaylists = async() => {
        const res = await AuthenticatedGETReq(`/playlist/user-playlists/${id}`)
        console.log(res)
        if(res.success){
            const plists = res.data
            setPlaylists(plists)
        }else{
            setPlaylists([])
        }
    }

    useEffect(() => {
        DataFetch()
    },[])

    useEffect(() => {
        fetchPlaylists()
    },[id])


    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            setPlaylistsSelected((prev) => [...prev, {id: e.target.id, add: true}]); // Add to the array
        } else {
            setPlaylistsSelected((prev) => [...prev, {id: e.target.id, add: false}]); // Remove from the array
        }
    };

    const addToPlaylist = async () => {
        console.log(playlistsSelected)
        const data = await AuthenticatedPOSTReq("/playlist/add-song-playlist", {
            songId: songToAdd,
            playlists: playlistsSelected
        })
        console.log(data)
        if(data.success){
            setToast("Song added to selected playlists!")
        }else{
            setPlaylistError("Oops, error in adding song to the playlists...")
            return 0;
        }
    
        

        setAddSong(false)
        setPlaylistError("")
        setLoading(false)
        setPlaylistsSelected([])
        setSongToAdd("")

        if(location.pathname.startsWith("/playlist/")){
            window.location.reload()
        }
    }

    const songExists = async (songId) => {
        const existsArray = await Promise.all(
            playlists.map(async (playlist) => {
                const res = await AuthenticatedPOSTReq("/playlist/song-exists-playlist", {
                    songId,
                    playlistId: playlist._id
                });
                return res.success ? res.data.exists : false;
            })
        );
      
        setSongInPlaylist(existsArray);
        
    };
    

    useEffect(() => {
        console.log("im enetring the set song exists effect and song id is", songToAdd)
        if(!songToAdd) return;
        songExists(songToAdd)
    },[addSong, songToAdd])


    return (
        <>
        <div className="w-full text-white flex h-[60px] hover:bg-white/10 rounded-md items-center p-2 cursor-pointer mt-1 group">
            <div className="w-[5%] text-center text-white/60 group-hover:text-white relative">
                <div className="group-hover:hidden">{index +1}</div>
                <button className="group-hover:block hidden hover:flex justify-center items-center text-2xl absolute h-full -top-3 left-3"
                onClick={() => playSong(name,thumbnail,trackUrl,artistFirstName,artistSecondName)}
                ><IoIosPlay /></button>
            </div>
            <img src={thumbnail} className="w-10 h-10 rounded-sm"/>
            <div className="flex flex-col ml-4 flex-grow">
                <p className="text-white text-sm">{name}</p>    
            </div>
            <p className="text-white/60 hover:underline text-sm w-[25%] group-hover:text-white">{artistFirstName + " " + artistSecondName}</p>
            <p className="text-white/60 text-sm w-[10%] text-center group-hover:text-white">{duration}</p>
            <div onClick={() => {
                setSongToAdd(songId)
                setTimeout(() => setAddSong(true), 1500)
                
                
                
            }} className="text-white/60 w-[5%] opacity-0 group-hover:opacity-100 transition-all text-xl hover:text-white"><BiPlusCircle/></div>
            
        </div>

        {
        addSong && 
        <div className="bg-black absolute h-[calc(100vh-130px)] w-[100vw] z-10 top-0 left-0 backdrop-blur-sm bg-opacity-20 flex justify-center items-center">
            <div className="bg-black w-[40%] h-[80%] rounded-xl relative">
                <div className="w-full h-full bg-white bg-opacity-10 rounded-xl flex flex-col p-8 gap-4">
                    <div className="text-white font-semibold text-xl flex justify-between items-start">Add to playlist
                        <button onClick={() => {
                            setAddSong(false)
                            setPlaylistError("")
                            setLoading(false)
                            setPlaylistsSelected([])
                            setSongToAdd("")
                            setSongInPlaylist([])
                        }}
                            className="text-base text-white text-opacity-55 hover:text-opacity-100 transition-all"><CgClose/>
                        </button>
                    </div>    
                    <div className="flex flex-col w-full p-[8px] overflow-auto scrollbar-hide max-h-[95%]">
                        {playlists && playlists.length > 0 ? 
                            playlists.map((playlist, index) => (
                                <div className="w-[100%] h-[65px] rounded-md flex p-[8px] hover:bg-white/10 gap-2  cursor-pointer">
                                    {playlist.thumbnail ? 
                                        <img src={playlist.thumbnail} className="h-full rounded-sm max-w-[50px]"/>
                                        :
                                        <div className="w-[50px] min-h-[50px] h-full flex justify-center items-center text-lg bg-white/5 rounded-sm text-white/60"><PiMusicNotesSimple /></div>
                                    }
                                    <div className="flex flex-col justify-center items-start flex-grow">
                                        <div className="text-white text-sm truncate overflow-hidden text-ellipsis w-[200px]">
                                        {playlist.name}
                                        </div>
                                        <div className="text-white/60 text-xs">{playlist.owner}</div>
                                    </div>
                                    <div className="flex justify-center items-center w-[7%]">
                                        <input type="checkbox" class="hidden peer" id={playlist._id}
                                        onChange={handleCheckboxChange
                                        }
                                        defaultChecked={!!songInPlaylist[index]}
                                        ></input>
                                        <label for={playlist._id}
                                        className={`w-[20px] h-[20px] cursor-pointer border-[1px] border-white/60 rounded-full peer-checked:bg-green-500 peer-checked:border-green-500 text-white/50 text-xs justify-center items-center flex`}
                                        >
                                            <FaCheck/>
                                        </label>
                                    </div>
                                </div>
                            ))
                            :
                            <div></div>
                        }
                    </div>
                    <div className="flex justify-between w-full h-[70px]">
                        {loading && <div className="text-5xl text-green-500 animate-spin"><LuLoaderCircle/></div>}
                        {playlistError && <p className="text-xs text-red-500 font-semibold">{playlistError}</p>}
                        <button onClick={() => {
                            addToPlaylist()
                            setLoading(true)

                        }} className="bg-white rounded-full font-semibold py-2 px-4 absolute right-4 bottom-3">Done</button>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    );
}
 
export default HorizontalCard;