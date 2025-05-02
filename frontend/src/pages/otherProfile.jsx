import { useParams } from "react-router-dom";
import { SearchContext } from "../utils/searchContext";
import { useContext, useState, useEffect } from "react";
import { AuthenticatedGETReq } from "../utils/server.helpers";
import { SearchPage } from "../components/search_Page";
import { LuLoaderCircle } from "react-icons/lu";
import HorizontalCard from "../components/songHorizontalCard";
import PlaylistCard from "../components/PlaylistCard";
import { PiMusicNotesSimple } from "react-icons/pi";

const OtherProfile = () => {

    const {userId} = useParams()
    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [username,setUsername] = useState("")
    const [isArtist, setIsArtist] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    const [logo,setLogo] = useState("")
    const [id,setId] = useState("")
    const [avatar, setAvatar] = useState("")
    const [songs,setSongs] = useState([])
    const [playlists, setPlaylists] = useState([])
    const {inSearch} = useContext(SearchContext)
    const [error,setError] = useState(false)

    async function DataFetch(){
        console.log("id", userId)
        const res = await AuthenticatedGETReq(`/user/get-other-user/${userId}`)
        console.log("pofile fetch:", res)
        if(!res.success){
            alert("Error loading user data.")
            setError(true)
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        setFirstName(res.data.firstName)
        setSecondName(res.data.secondName)
        setUsername(res.data.username)
        setIsArtist(res.data.isArtist)
        setId(res.data._id)
        if(res.data.avatar){
            setAvatar(res.data.avatar)
        }
        const first = res?.data?.firstName?.[0]
        const second = res?.data?.secondName?.[0] || ""
        setLogo(`${first}${second}`)
    }

    const fetchPlaylists = async() => {
        const res = await AuthenticatedGETReq(`/playlist/user-playlists/${userId}`)
        console.log(res)
        if(res.success){
            const plists = res.data
            setPlaylists(plists)
            
            
        }else{
            setPlaylists([])
        }
        
    }

    const fetchUserSongs = async() => {
        if(!isArtist) return
        const res = await AuthenticatedGETReq("/song/get-others-songs/"+userId)

        setSongs(res.data)
        console.log(songs)
    }

    useEffect(() => {
        fetchUserSongs()
        fetchPlaylists()
        setTimeout(() => {
            DataFetch()
        },1500)
        console.log(playlists)
    },[isArtist]) 

    if(isLoading){
        return (
            
            <div className="bg-black w-full flex justify-center flex-col items-center top-0 left-0 z-10 absolute min-h-screen">
                <div className="text-4xl text-green-500 animate-spin"><LuLoaderCircle/></div>
                <div className="text-white mt-6 font-semibold text-3xl">Loading...</div>
            </div>
                
        );
    }

    return (
        <>
        <div className="absolute lg:w-[75.5%] md:w-[75%] sm:w-[75%] 2xl:w-[82%] right-0 h-[calc(100%-75px)] overflow-hidden flex justify-center bg-white bg-opacity-5">
            
            <div className="w-full h-[calc(100vh-68px)] max-w-[1500px] rounded-lg text-black bg-black relative pt-0 flex gap-2">
                
                <div className={`w-full h-[calc(100%-75px)] bg-white bg-opacity-5 rounded-lg flex gap-2 flex-col overflow-y-auto custom-scrollbar ${inSearch ? "" : "justify-start"}`}>
                    {
                        inSearch ? 
                        <div className="p-6"><SearchPage/></div>
                        :
                        <>
                        <div className="w-full bg-gradient-to-b from-white/25 to-white/5 min-h-[280px] px-6 py-3 flex justify-end flex-col">
                            <div className="w-full flex pb-4 ">
                                {avatar ? 
                                <img src={avatar} className="h-32 w-32 rounded-full shadow-xl flex justify-center items-center object-center object-cover"/>
                                :
                                <div className="h-32 w-32 rounded-full bg-pink-300 shadow-xl flex justify-center items-center text-5xl font-semibold">
                                {logo}
                                </div>}
                                <div className="px-8 flex flex-col justify-start">
                                    <div className="text-white">Profile</div>
                                    <div className="text-4xl font-bold text-white flex flex-col gap-3 justify-center mr-auto">{firstName + " " + secondName}
                                    {isArtist ? 
                                        <div className="text-white text-opacity-25 font-semibold text-sm">Artist</div>
                                        :
                                        <div className="text-white text-opacity-25 font-semibold text-sm">User</div>
                                    }
                                    </div>
                                    <div className="text-white text-opacity-35 font-semibold text-sm">@{username}</div>
                                </div>
                            </div>
                        </div>
                        {isArtist && 
                            <div className="p-6 ">
                                <div className="text-white font-semibold text-2xl">Your Songs</div>
                                <div className="text-sm font-normal text-opacity-60 text-white mb-2">Visible to everybody</div>
                                <div className="flex flex-col w-full max-h-[200px] overflow-y-scroll scrollbar-hide">
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
                                        queueGiven={null}
                                        />
                                    ))
                                    :
                                    <div className="text-sm text-white text-opacity-60">This artist has no songs yet...</div>
                                }
                                </div>
                            </div>
                        }

                        <div className="text-white p-6 text-2xl w-full min-h-[350px]">
                            <div className="font-semibold">Public Playlists</div>
                            <div className="text-sm font-normal text-opacity-60 text-white">Visible to everybody</div>
                            <div className="h-fit flex mt-3 pb-4 overflow-x-auto scrollbar-hide">
                                {playlists && playlists.length > 0 ? 
                                    <>
                                    {playlists.map((playlist) => (  
                                        <PlaylistCard image={playlist.thumbnail} name={playlist.name} owner={playlist.owner} id={playlist._id}/>
                                    ))}
                                    </>
                                :
                                    <div className="min-w-[190px] relative p-3 hover:bg-white/10 rounded-lg transition-all cursor-pointer group flex flex-col h-[250px]">
                                        <div className="max-w-[250px] max-h-[250px] w-full h-full flex justify-center items-center text-7xl bg-white/5 rounded-md  text-white/60"><PiMusicNotesSimple /></div>
                                        <div className="text-white text-base mt-2 hover:underline truncate">No Playlists</div>
                                        <div className="text-white/60 text-xs mt-1">This user has no playlists yet...</div>
                                    </div>   
                                }
                            </div>
                        </div>
                        </>
                    }

                </div>
            </div>

            
        
        </div> 
        </>
        );
}

export default OtherProfile;