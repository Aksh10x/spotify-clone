import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { AuthenticatedGETReq, AuthenticatedPATCHReq, AuthenticatedPOSTFormReq } from "../utils/server.helpers.js";
import { Link } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { BsPencil, BsThreeDots } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

const Profile = () => {

    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [username,setUsername] = useState("")
    const [isArtist, setIsArtist] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    const [logo,setLogo] = useState("")

    const[popup,setPopup] = useState(false)
    const [file, setFile] = useState(null)
    const [avatar, setAvatar] = useState("")
    const [isError, setIsError] = useState(false)
    const [editProfile, setEditProfile] = useState(false)
    const [deletePhoto, setDeletePhoto] = useState(false)

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        setIsLoading(false)
        setFirstName(res.data.firstName)
        setSecondName(res.data.secondName)
        setUsername(res.data.username)
        setIsArtist(res.data.isArtist)
        if(res.data.avatar){
            setAvatar(res.data.avatar)
        }
        const first = res?.data?.firstName?.[0]
        const second = res?.data?.secondName?.[0] || ""
        setLogo(`${first}${second}`)
    }

    //get all details
    useEffect(() => {
        setTimeout(DataFetch,1500)
    },[isArtist]) 


    const toggleArtist = async() => {
        const res = await AuthenticatedPATCHReq("/user/toggle-artist")
        if(res.success)
        setIsArtist((prev) => !prev)
        
    }

    if(isLoading){
        return (
            
            <div className="bg-black w-full h-screen flex justify-center flex-col items-center">
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



    return (
        <>
        <div className="relative w-full h-screen overflow-hidden">
            <Navbar/>
            <div className="w-full h-[calc(100vh-60px)] text-black bg-black relative p-2 pt-0 flex gap-2">
                <Sidebar/>
                <div className="w-full h-[100%] bg-white bg-opacity-10 rounded-lg flex gap-2 flex-col overflow-y-auto scrollbar-hide">
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
        

        </>
    );
}
 
export default Profile;