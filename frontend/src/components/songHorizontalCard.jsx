import React, { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthenticatedGETReq, AuthenticatedPOSTReq } from '../utils/server.helpers';
import { SongContext } from '../utils/songContext';
import { FiBarChart2 } from 'react-icons/fi';
import { IoIosPlay } from 'react-icons/io';
import { BiPlusCircle } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { FaCheck } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';
import { PiMusicNotesSimple } from 'react-icons/pi';


const HorizontalCard = ({songId, index, thumbnail, name, artistFirstName, artistSecondName, hlsUrl, queueGiven, duration}) => {
    const [addSong, setAddSong] = useState(false);
    const [playlists, setPlaylists] = useState([])
    const [id, setId] = useState("")
    const [songToAdd, setSongToAdd] = useState("")
    const [playlistsSelected, setPlaylistsSelected] = useState([])
    const [playlistError, setPlaylistError] = useState("")
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState("")
    const [songInPlaylist, setSongInPlaylist] = useState([])
    const location = useLocation()
    const [artistId, setArtistId] = useState("")
    const [formattedDuration, setFormattedDuration] = useState("0:00");

    const {
        playingId, setPlayingId,
        songName, setSongName,
        songThumbnail, setSongThumbnail,
        isPlaying, setIsPlaying,
        artist, setArtist,
        queue, setQueue,
        currentIndex, setCurrentIndex,
        setSongHlsUrl
    } = useContext(SongContext)

    useEffect(() => {
        if (duration) {
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            setFormattedDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        }
    }, [duration]);

    const playSong = (name, thumbnail, hlsUrl, artistFirstName, artistSecondName) => {
        setPlayingId(songId)
        setSongName(name)
        setSongThumbnail(thumbnail)
        setSongHlsUrl(hlsUrl)
        setArtist(artistFirstName + " " + artistSecondName)
        
        if(queueGiven && queueGiven.length > 0){
            setQueue(queueGiven)
            setCurrentIndex(index)
        }
    }

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        setId(res.data._id)
    }

    const fetchPlaylists = async() => {
        const res = await AuthenticatedGETReq(`/playlist/user-playlists/${id}`)
        if(res.success){
            const plists = res.data
            setPlaylists(plists)
        }else{
            setPlaylists([])
        }
    }

    useEffect(() => {
        DataFetch()
        getArtistId(songId)
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
        const data = await AuthenticatedPOSTReq("/playlist/add-song-playlist", {
            songId: songToAdd,
            playlists: playlistsSelected
        })
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
    
    const getArtistId = async (songId) => {
        const res = await AuthenticatedGETReq(`/song/whos-the-artist/${songId}`)
        if(res.success){
            setArtistId(res.data)
        }else{
            return null
        }
    }
    

    useEffect(() => {
        if(!songToAdd) return;
        songExists(songToAdd)
    },[addSong, songToAdd])


    return (
        <>
        <div className="w-full text-white flex h-[60px] hover:bg-white/10 rounded-md items-center p-2 cursor-pointer mt-1 group">
            <div className="w-[5%] text-center text-white/60 group-hover:text-white relative">
                {
                    songId == playingId ?
                    <div className="text-green-500 text-xl flex justify-center items-center"><FiBarChart2 /></div> :
                    <>
                        <div className={`group-hover:hidden text-sm flex justify-center items-center text-white/60`}>{index +1 }</div>
                        <button className="group-hover:block hidden hover:flex justify-center items-center text-2xl absolute h-full -top-3 left-3"
                        onClick={() => playSong(name, thumbnail, hlsUrl, artistFirstName, artistSecondName)}
                        ><IoIosPlay />
                        </button>
                    </>
                }
            </div>
            <img src={thumbnail} className="w-10 h-10 rounded-sm"/>
            <div className="flex flex-col ml-4 flex-grow">
                <p className={` text-sm ${songId == playingId ? "text-green-500" : "text-white"}`}>{name}</p>    
            </div>
            <Link to={`/profile/${artistId}`} className="text-white/60 hover:underline text-sm w-[25%] group-hover:text-white">{artistFirstName + " " + artistSecondName}</Link>
            <p className="text-white/60 text-sm w-[10%] text-center group-hover:text-white">{formattedDuration}</p>
            <div onClick={() => {
                setSongToAdd(songId)
                setTimeout(() => setAddSong(true), 1500)
                
                
                
            }} className="text-white/60 w-[5%] opacity-0 group-hover:opacity-100 transition-all text-xl hover:text-white"><BiPlusCircle/></div>
            
        </div>

        {
        addSong && 
        <div className="fixed top-[60px] lg:w-[75.5%] md:w-[75%] sm:w-[75%] 2xl:w-[82%] right-0 bottom-[83px] z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/20"
                onClick={() => setAddSong(false)}
            ></div>
            <div className="bg-[#121212] shadow-lg shadow-black  w-[500px] max-w-[90%] rounded-xl border border-white/10 z-10">
                <div className="w-full h-full bg-white/5 rounded-xl flex flex-col p-6 gap-4">
                    <div className="text-white font-semibold text-xl flex justify-between items-center">
                        Add to playlist
                        <button 
                            onClick={() => setAddSong(false)}
                            className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                        >
                            <CgClose size={20}/>
                        </button>
                    </div>    
                    <div className="flex flex-col w-full max-h-[60vh] overflow-auto scrollbar-hide">
                        {playlists && playlists.length > 0 ? 
                            playlists.map((playlist, index) => (
                                <div key={playlist._id} className="w-full p-2 rounded-md flex items-center hover:bg-white/10 gap-3 cursor-pointer">
                                    {/* Existing playlist item content */}
                                    {playlist.thumbnail ? 
                                        <img src={playlist.thumbnail} className="h-12 w-12 rounded-sm object-cover object-center"/>
                                        :
                                        <div className="w-12 h-12 flex justify-center items-center text-lg bg-white/5 rounded-sm text-white/60">
                                            <PiMusicNotesSimple />
                                        </div>
                                    }
                                    <div className="flex flex-col justify-center flex-grow">
                                        <div className="text-white text-sm truncate">
                                            {playlist.name}
                                        </div>
                                        <div className="text-white/60 text-xs">{playlist.owner}</div>
                                    </div>
                                    <div className="flex justify-center items-center pr-2">
                                        <input 
                                            type="checkbox" 
                                            className="hidden peer" 
                                            id={playlist._id}
                                            onChange={handleCheckboxChange}
                                            defaultChecked={!!songInPlaylist[index]}
                                        />
                                        <label 
                                            htmlFor={playlist._id}
                                            className="w-5 h-5 cursor-pointer border border-white/60 rounded-full 
                                                    peer-checked:bg-green-500 peer-checked:border-green-500 
                                                    flex items-center justify-center transition-all"
                                        >
                                            <FaCheck className="text-white text-[10px]"/>
                                        </label>
                                    </div>
                                </div>
                            ))
                            :
                            <div className="text-white/60 text-center py-4">No playlists found. Create a playlist first.</div>
                        }
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
                        {loading && 
                            <div className="text-green-500 flex items-center">
                                <LuLoaderCircle className="animate-spin mr-2" />
                                <span className="text-sm">Adding to playlist...</span>
                            </div>
                        }
                        {playlistError && 
                            <p className="text-sm text-red-500">{playlistError}</p>
                        }
                        <button 
                            onClick={() => {
                                addToPlaylist();
                                setLoading(true);
                            }} 
                            className="ml-auto bg-white rounded-full font-semibold py-2 px-6 text-black hover:scale-105 transition-transform"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    );
}
 
export default HorizontalCard;