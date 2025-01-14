import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { AuthenticatedGETReq, AuthenticatedPATCHReq, AuthenticatedPOSTFormReq, getAudioDurationFromURL } from "../utils/server.helpers.js";
import { Link } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { BsPencil, BsThreeDots } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import HorizontalCard from "../components/songHorizontalCard.jsx";
import SongCard from "../components/songCard.jsx";
import { FaCirclePlay } from "react-icons/fa6";
import { BiPlus } from "react-icons/bi";

const Profile = () => {

    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [username,setUsername] = useState("")
    const [isArtist, setIsArtist] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    const [logo,setLogo] = useState("")
    const [id,setId] = useState("")

    const [popup,setPopup] = useState(false)
    const [file, setFile] = useState(null)
    const [avatar, setAvatar] = useState("")
    const [isError, setIsError] = useState(false)
    const [editProfile, setEditProfile] = useState(false)
    const [deletePhoto, setDeletePhoto] = useState(false)
    const [songs,setSongs] = useState([])
    const [playlists, setPlaylists] = useState([1,2,3,4,5,6,7,8])
    const [newPlaylist, setNewPlaylist] = useState(false)

    const [playlistThumbnail, setPlaylistThumbnail] = useState(null)
    const [playlistName, setPlaylistName] = useState("My Playlist")
    const [playlistDesc, setPlaylistDesc] = useState("")
    const [loading, setLoading] = useState(false)

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
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
        const res = await AuthenticatedGETReq(`/playlist/user-playlists/${id}`)
        if(res.success){
            setPlaylists(res.data)
        }else{
            setPlaylists([])
        }
    }

    const fetchUserSongs = async() => {
        const res = await AuthenticatedGETReq("/song/get-my-songs")
        setSongs(res.data)
        console.log(songs)
    }

    //get all details
    useEffect(() => {
        fetchUserSongs()
        setTimeout(() => {
            fetchPlaylists()
            DataFetch()
        },1500)
    },[isArtist]) 


    const toggleArtist = async() => {
        const res = await AuthenticatedPATCHReq("/user/toggle-artist")
        if(res.success)
        setIsArtist((prev) => !prev)
        
    }

    if(isLoading){
        return (
            
            <div className="bg-black w-full h-screen flex justify-center flex-col items-center absolute z-10">
                <div className="text-4xl text-green-500 animate-spin"><LuLoaderCircle/></div>
                <div className="text-white mt-6 font-semibold text-3xl">Loading...</div>
            </div>
                
        );
    }

    

    const becomeArtist = async(firstName,secondName,file) => {
        const formData = new FormData()
        formData.append("avatar", file)
        formData.append("firstName", firstName)
        formData.append("secondName", secondName)
        const res = await AuthenticatedPOSTFormReq("/user/become-artist",formData)
        if(res.success){
            setIsError("")
            setPopup(false)
            window.location.reload()
        }
        else{
            setIsError(res.message)
        }
    }

    const callEditProfile = async(firstName,secondName,file,deletePhoto) => {
        const formData = new FormData()
        formData.append("avatar", file)
        formData.append("firstName", firstName)
        formData.append("secondName", secondName)
        formData.append("deletePhoto", deletePhoto)
        const res = await AuthenticatedPOSTFormReq("/user/edit-details",formData)
        if(res.success){
            setIsError("")
            setPopup(false)
            window.location.reload()
        }
        else{
            setIsError(res.message)
        }
    }


    const addPlaylist = async(playlistName,playlistDesc,playlistThumbnail) => {
        const formData = new FormData()
        formData.append("thumbnail", playlistThumbnail)
        formData.append("name", playlistName)
        formData.append("description", playlistDesc)

        setLoading(true)
        const res = await AuthenticatedPOSTFormReq("/playlist/create",formData)
        setLoading(false)
        if(res.success){
            console.log(res)
            setNewPlaylist(false)
            window.location.reload()
        }
        else{
            setIsError(res.message)
        }
    }

    
    



    return (
        <>
        <div className="relative w-full h-screen overflow-hidden">
            <Navbar/>
            <div className="w-full h-[calc(100vh-60px)] text-black bg-black relative p-2 pt-0 flex gap-2">
                <Sidebar/>
                <div className="w-full h-[calc(100%-75px)] bg-white bg-opacity-5 rounded-lg flex gap-2 flex-col overflow-y-auto scrollbar-hide justify-evenly">
                    <div className="w-full bg-gradient-to-b from-white/25 to-white/5 min-h-[280px] px-6 py-3 flex justify-end flex-col">
                        <div className="w-full flex pb-4 ">
                            {avatar ? 
                            <img src={avatar} className="h-32 w-32 rounded-full shadow-xl flex justify-center items-center bg-cover"/>
                            :
                            <div className="h-32 w-32 rounded-full bg-pink-300 shadow-xl flex justify-center items-center text-5xl font-semibold">
                            {logo}
                            </div>}
                            <div className="px-8 flex flex-col justify-start">
                                <div className="text-white">Profile</div>
                                <div className="text-4xl font-bold text-white flex gap-3 justify-center mr-auto">{firstName + " " + secondName}
                                    <button className="text-white text-2xl  text-opacity-40 hover:text-opacity-100 transition-all group relative" onClick={() => {setPopup(true)
                                        setEditProfile(true)
                                    }}><BsThreeDots />
                                    <div className="opacity-0 group-hover:opacity-100 text-sm absolute top-0 left-8 w-[100px] transition-all bg-black bg-opacity-35 rounded-sm py-1 font-light">Edit Profile</div>
                                    </button>
                                </div>
                                <div className="text-white text-opacity-35 font-semibold text-sm">@{username}</div>
                                <button className="mr-auto mt-4 text-black font-semibold bg-white px-4 py-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105"
                                onClick={() => {setPopup(true)}}
                                >{isArtist ? <p>Delete Artist</p> : <p>Become an Artist</p>}</button>
                            </div>
                        </div>
                    </div>
                    {isArtist && 
                        <div className="p-6 ">
                            <div className="text-white font-semibold text-2xl">Your Songs</div>
                            <div className="text-sm font-normal text-opacity-60 text-white mb-2">Visible to everybody</div>
                            {songs != [] ? 
                                songs?.map((song, index) => (
                                    <HorizontalCard 
                                    name={song.name} 
                                    artistFirstName={song.artistFirstName}
                                    artistSecondName={song.artistSecondName}
                                    thumbnail={song.thumbnail}
                                    trackUrl={song.track}
                                    index={index}
                                    />
                                ))
                                :
                                <div className="text-sm text-white text-opacity-60">Upload your first song!</div>
                            }
                            <div className="mt-6">
                                <Link className="mr-auto text-black font-semibold bg-white px-4 py-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105"
                                to={"/uploadSong"}
                                >
                                    Upload a song
                                </Link>
                            </div>
                        </div>
                    }

                    <div className="text-white p-6 font-semibold text-2xl w-full min-h-[800px]">
                        <div>Public Playlists</div>
                        <div className="text-sm font-normal text-opacity-60 text-white">Visible to everybody</div>
                        <div className="h-[580px] flex mt-3 gap-2 overflow-x-scroll scrollbar-hide">
                            {playlists && playlists.length > 0 ? 
                                <>
                                <div className="min-w-[190px] h-[45%] relative p-4 bg-black bg-opacity-15 hover:bg-white rounded-lg hover:bg-opacity-15 transition-all cursor-pointer group"
                                onClick={() => {
                                    setNewPlaylist(true)
                                }}
                                >
                                    <div className="h-[70%] w-full rounded-lg shadow-xl bg-gradient-to-br from-purple-500 via-purple-400 to-white flex justify-center items-center text-6xl"> 
                                        <BiPlus/>
                                    </div>
                                    <div className="text-white font-semibold text-lg mt-2">New Playlist</div>
                                    <div className="text-white text-opacity-25 font-semibold text-sm mt-1"></div>
                                </div>   
                                {playlists.map((playlist) => (
                                    <SongCard image={playlist.thumbnail} name={playlist.name} artist={playlist.owner}/>
                                ))}
                                </>
                            :
                                <div className="min-w-[190px] h-[45%] relative p-4 bg-black bg-opacity-15 hover:bg-white rounded-lg hover:bg-opacity-15 transition-all cursor-pointer group"
                                onClick={() => {
                                    setNewPlaylist(true)
                                }}
                                >
                                    <div className="h-[70%] w-full rounded-lg shadow-xl bg-gradient-to-br from-purple-500 via-purple-400 to-white flex justify-center items-center text-6xl"> 
                                        <BiPlus/>
                                    </div>
                                    <div className="text-white font-semibold text-lg mt-2">New Playlist</div>
                                    <div className="text-white text-opacity-25 font-semibold text-sm mt-1"></div>
                                </div>   
                            }
                        </div>
                    </div>

                </div>
            </div>

            
        
        </div>


        {(popup && !isArtist && !editProfile) &&
            <div className="bg-black w-full h-screen bg-opacity-40 backdrop-blur-md absolute top-0 flex justify-center items-center">
                <div className="bg-black w-[40%] h-[60%] min-h-[350px] min-w-[600px] max-w-[800px] rounded-xl">
                    <div className="w-full h-full bg-white bg-opacity-10 rounded-xl flex flex-col p-8 gap-4">
                        <div className="text-white font-semibold text-3xl flex justify-between items-start">Profile details

                            <button onClick={() => setPopup(false)}
                                className="text-base text-white text-opacity-55 hover:text-opacity-100 transition-all"><CgClose/></button>
                        </div>
                        <div className="flex gap-12">
                            <input type="file" accept="image/*" hidden id="pfpInput" onChange={(e) => {
                                const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
                                if (!validImageTypes.includes(e.target.files?.[0]?.type)) {
                                alert("Only image files are allowed!");
                                return;
                                }
                                setFile(e.target.files?.[0])
                            }}>
                                
                            </input>
                            {avatar ?
                            <label for="pfpInput" className="bg-black relative w-40 h-40 text-7xl text-white text-opacity-50 bg-opacity-15 rounded-full flex flex-col justify-center items-center cursor-pointer group shadow-lg">
                                <img src={avatar} className="h-36 w-36 rounded-full shadow-xl flex justify-center items-center"/>
                                <div className="absolute group-hover:visible invisible w-36 h-36 bg-black bg-opacity-45 transition-all flex justify-center items-center rounded-full"><BsPencil/></div>
                                {file && <div className="text-xs text-green-400 absolute -bottom-4">Picture uploaded!</div>}
                            </label>
                            
                            : <label for="pfpInput" className="bg-black relative w-40 h-40 text-7xl text-white text-opacity-50 bg-opacity-15 rounded-full flex justify-center items-center cursor-pointer group shadow-lg">
                                <IoPersonOutline />
                                <div className="absolute group-hover:visible invisible w-40 h-40 bg-black bg-opacity-45 transition-all flex justify-center items-center rounded-full"><BsPencil/></div>
                                
                            </label>}
                            

                            <div className="text-white mt-3 font-semibold">
                                <div className="text-sm font-semibold">First Name</div>
                                <input className="w-full px-3 bg-transparent rounded h-[35px] transition bg-white bg-opacity-15 hover:bg-opacity-20"
                                type="text" 
                                onChange={(e) => {setFirstName(e.target.value)}}
                                defaultValue={firstName}
                                ></input>
                                <div className="text-sm font-semibold mt-2">Second Name</div>
                                <input className="w-full px-3 bg-transparent rounded h-[35px] transition bg-white bg-opacity-15 hover:bg-opacity-20"
                                type="text" 
                                onChange={(e) => {setSecondName(e.target.value)}}
                                defaultValue={secondName}
                                ></input>
                                <button onClick={() => {becomeArtist(firstName,secondName,file)}}
                                className="text-black font-semibold bg-white px-3 py-3 mt-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-sm"
                                >Become an artist</button>
                            </div>
                        </div>
                        
                        <div className="text-white font-semibold text-xs flex flex-grow flex-col">
                            {isError && <div className="text-xs text-red-500 text-center">{isError}</div>}
                            <div className="mt-auto">Artists are required to have a profile picture. Please make sure you have the right to upload the image.</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        }

        {(popup && isArtist && !editProfile) &&
            <div className="bg-black w-full h-screen bg-opacity-40 backdrop-blur-md absolute top-0 flex justify-center items-center">
                <div className="bg-black w-[40%] h-[50%] min-h-[330px] min-w-[600px] max-w-[800px] rounded-xl max-h-[350px]">
                    <div className="w-full h-full bg-white bg-opacity-10 rounded-xl flex flex-col p-8 gap-4">
                        <div className="text-white font-semibold text-3xl flex justify-between items-start">Delete your artist profile?

                            <button onClick={() => setPopup(false)}
                                className="text-base text-white text-opacity-55 hover:text-opacity-100 transition-all"><CgClose/></button>
                        </div>
                        <div className="flex flex-grow text-white font-semibold text-xl text-opacity-60">Are you sure that you want to delete you artist profile? Once your artist profile is deleted, all your uploaded songs will also be deleted. Please click confirm if you wish to proceed.</div>
                        <div className="text-white font-semibold text-xs flex flex-grow justify-end gap-4">
                            <button className="text-black font-semibold bg-white px-3 py-2 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-lg h-fit min-w-[120px]" onClick={() => setPopup(false)}>Cancel</button>
                            <button className="text-red-500 font-semibold bg-white px-3 py-2 rounded-full hover:bg-red-100 transition-all hover:scale-105 text-lg h-fit min-w-[120px]" 
                            onClick={() => {
                                toggleArtist()
                                setPopup(false)
                            }}>Confirm</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        }

        {(popup && editProfile) &&
            <div className="bg-black w-full h-screen bg-opacity-40 backdrop-blur-md absolute top-0 flex justify-center items-center">
                <div className="bg-black w-[40%] h-[60%] min-h-[350px] min-w-[600px] max-w-[800px] rounded-xl">
                    <div className="w-full h-full bg-white bg-opacity-10 rounded-xl flex flex-col p-8 gap-4">
                        <div className="text-white font-semibold text-3xl flex justify-between items-start">Profile details

                            <button onClick={() => {setPopup(false)
                            setEditProfile(false)}}
                                className="text-base text-white text-opacity-55 hover:text-opacity-100 transition-all"><CgClose/></button>
                        </div>
                        <div className="flex gap-12">
                            <input type="file" accept="image/*" hidden id="pfpInput" onChange={(e) => {
                                const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
                                if (!validImageTypes.includes(e.target.files?.[0]?.type)) {
                                alert("Only image files are allowed!");
                                return;
                                }
                                setFile(e.target.files?.[0])
                            }}>
                                
                            </input>
                            {(!deletePhoto) ?
                            <label for="pfpInput" className="bg-black relative w-40 h-40 text-7xl text-white text-opacity-50 bg-opacity-15 rounded-full flex flex-col justify-center items-center cursor-pointer group shadow-lg">
                                <img src={avatar} className="h-36 w-36 rounded-full shadow-xl flex justify-center items-center"/>
                                <div className="absolute group-hover:visible invisible w-36 h-36 bg-black bg-opacity-45 transition-all flex justify-center items-center rounded-full"><BsPencil/></div>
                                {file && <div className="text-xs text-green-400 absolute -bottom-4">Picture uploaded!</div>}
                            </label>
                            
                            : <label for="pfpInput" className="bg-black relative w-40 h-40 text-7xl text-white text-opacity-50 bg-opacity-15 rounded-full flex justify-center items-center cursor-pointer group shadow-lg">
                                <IoPersonOutline />
                                <div className="absolute group-hover:visible invisible w-40 h-40 bg-black bg-opacity-45 transition-all flex justify-center items-center rounded-full"><BsPencil/></div>
                                
                            </label>}
                            

                            <div className="text-white mt-3 font-semibold">
                                <div className="text-sm font-semibold">First Name</div>
                                <input className="w-full px-3 bg-transparent rounded h-[35px] transition bg-white bg-opacity-15 hover:bg-opacity-20"
                                type="text" 
                                onChange={(e) => {setFirstName(e.target.value)}}
                                defaultValue={firstName}
                                ></input>
                                <div className="text-sm font-semibold mt-2">Second Name</div>
                                <input className="w-full px-3 bg-transparent rounded h-[35px] transition bg-white bg-opacity-15 hover:bg-opacity-20"
                                type="text" 
                                onChange={(e) => {setSecondName(e.target.value)}}
                                defaultValue={secondName}
                                ></input>
                                <button onClick={() => {callEditProfile(firstName,secondName,file,deletePhoto)}}
                                className="text-black font-semibold bg-white px-3 py-3 mt-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-sm"
                                >Save Changes</button>
                            </div>
                        </div>
                        {!isArtist && <button onClick={() => {
                            setFile(null)
                            setDeletePhoto(true)
                        }} className="font-semibold w-fit mr-auto text-sm text-white hover:underline">
                            OR Delete prfoile picture?
                        </button>}
                        <div className="text-white font-semibold text-xs flex flex-grow flex-col">
                            {isError && <div className="text-xs text-red-500 text-center">{isError}</div>}
                            <div className="mt-auto">By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        }


        {newPlaylist && 
        <div className="bg-black w-full h-screen bg-opacity-40 backdrop-blur-md absolute top-0 flex justify-center items-center">
            <div className="bg-black w-[40%] h-[60%] min-h-[450px] max-h-[500px] min-w-[600px] max-w-[800px] rounded-xl">
                <div className="w-full h-full bg-white bg-opacity-10 rounded-xl flex flex-col p-8 gap-4">
                    <div className="text-white font-semibold text-3xl flex justify-between items-start">Playlist details
                    <button onClick={() => {setNewPlaylist(false)
                    setPlaylistDesc("")
                    setPlaylistName("Playlist")
                    setPlaylistThumbnail(null)
                    }}
                        className="text-base text-white text-opacity-55 hover:text-opacity-100 transition-all"><CgClose/></button>
                    </div>
                    <div className="h-[70%] w-full flex gap-4">
                    <input type="file" accept="image/*" hidden id="thumbnailInput" onChange={(e) => {
                                const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
                                if (!validImageTypes.includes(e.target.files?.[0]?.type)) {
                                alert("Only image files are allowed!");
                                return;
                                }
                                setPlaylistThumbnail(e.target.files?.[0])
                                
                    }}
                    
                    defaultValue={playlistThumbnail}></input>
                    <label for="thumbnailInput" className="">
                        <div className="w-[200px] h-[200px] bg-white/10 rounded-md text-6xl flex justify-center items-center hover:bg-white/15 transition-all text-white">
                        <BiPlus/>
                        </div>
                    </label>
                    
                    <div className="text-white w-full">
                        <div className="text-sm font-semibold">Playlist Name</div>
                        <input className="w-full px-3 bg-transparent rounded h-[35px] transition bg-white bg-opacity-15 hover:bg-opacity-20 text-sm "
                        type="text" 
                        onChange={(e) => {setPlaylistName(e.target.value)}}
                        defaultValue={playlistName}
                        ></input>

                        <div className="text-sm font-semibold mt-2">Description</div>
                        <textarea className="w-full px-3 bg-transparent rounded max-h-[115px] min-h-[115px] transition bg-white bg-opacity-15 hover:bg-opacity-20 text-sm p-2"
                        type="text" 
                        onChange={(e) => {setPlaylistDesc(e.target.value)}}
                        defaultValue={playlistDesc}
                        ></textarea>
                        <div className="w-full flex justify-end">
                            <button onClick={() => {addPlaylist(playlistName,playlistDesc,playlistThumbnail)}}
                            className="text-black font-semibold bg-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-sm"
                            >Save</button>
                        </div>
                    </div>
                    
                    </div>


                    <div className="text-white font-semibold text-xs flex flex-grow flex-col">
                        {playlistThumbnail && !isError && <div className="text-xs text-green-500 text-center  mb-auto">Image uploaded!</div>}
                        {loading && <div className="text-sm text-white text-center mb-auto flex items-center justify-center w-full gap-1">
                            <div className="text-2xl text-green-400 animate-spin"><LuLoaderCircle/></div>Uploading your song...
                        </div>}
                        {isError && <div className="text-xs text-red-500 text-center">{isError}</div>}
                        <div className="mt-auto">By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.</div>
                    </div>
                </div>
            </div>
        </div>
        }
        

        </>
    );
}
 
export default Profile;