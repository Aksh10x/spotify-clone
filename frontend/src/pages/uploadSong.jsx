import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FaSpotify } from "react-icons/fa";
import { useState } from "react";
import { AuthenticatedPOSTFormReq } from "../utils/server.helpers";
import { LuLoaderCircle } from "react-icons/lu";

const Upload = () => {

    const [name,setName] = useState("")
    const [thumbnail,setThumbnail] = useState(null)
    const [track, setTrack] = useState(null)

    const [error,setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const uploadSong = async(thumbnail,name,track) => {
        if(name.trim() === ""){
            setError("Track name is required")
        }
        const formData = new FormData()
        formData.append("thumbnail", thumbnail)
        formData.append("name", name)
        formData.append("track", track)

        setIsLoading(true)
        const res = await AuthenticatedPOSTFormReq("/song/create", formData)
       
        
        if(res.success){
            console.log(res)
            
            setTimeout(() => {
                setIsLoading(false)
                navigate("/profile")
            })
        }
        else{
            setIsLoading(false)
            setError(res.message)
        }
        return;
    }


    return (
        <div className="w-full h-screen overflow-hidden absolute z-10">
            <div className="w-full h-full text-white bg-black relative pt-0 flex">
                <div className="w-full h-[100%] bg-white bg-opacity-10 p-6 flex gap-2 flex-col overflow-auto scrollbar-hide items-center justify-evenly">
                    <Link to={"/profile"} className="text-white text-opacity-40 text-4xl font-semibold
                    hover:scale-105 hover:text-white transition w-fit flex absolute top-4 left-4"
                    >
                        <MdOutlineKeyboardArrowLeft /> 
                    </Link>

                    <div className="text-white text-5xl flex items-center flex-col">
                        <FaSpotify/>
                    </div>

                    <div className="font-bold text-5xl mt-14">Upload your Song</div>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-12 mt-6">
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-semibold w-full">Name of the song</div>
                                <input className="w-[300px] px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[45px] transition hover:border-white"
                                type="text"
                                onChange={(e) => {setName(e.target.value)
                                    setError("")
                                }}
                                ></input>
                            </div>

                        </div>

                        <div className="flex justify-between w-[300px]">
                            <div className="flex flex-col gap-1 w-fit mt-4">
                                <div className="text-xs font-semibold">Thumbnail</div>
                                <input
                                    type="file"
                                    id="fileInputOne"
                                    class="hidden"
                                    onChange={(e) => {
                                        setError("")
                                        const validFileTypes = ["image/jpeg","image/jpg","image/png"]
                                        if(!validFileTypes.includes(e.target.files?.[0]?.type)){
                                            alert("Please upload a valid thumbnail.")
                                            return;
                                        }
                                        setThumbnail(e.target.files?.[0])
                                    }}
                                />
                                <label
                                    for="fileInputOne"
                                    class="px-4 py-2 bg-green-500 text-black text-sm font-semibold rounded cursor-pointer hover:bg-opacity-80 transition"
                                >
                                    Upload File
                                </label>
                                    
                            </div>

                            <div className="flex flex-col gap-1 w-fit mt-4">
                                <div className="text-xs font-semibold">Audio Track</div>
                                <input
                                    type="file"
                                    id="fileInputTwo"
                                    class="hidden"
                                    onChange={(e) => {
                                        setError("")
                                        const validFileTypes = ["audio/mpeg"]
                                        if(!validFileTypes.includes(e.target.files?.[0]?.type)){
                                            alert("Please upload a valid audio track(mp3 only).")
                                            return;
                                        }
                                        setTrack(e.target.files?.[0])
                                    }}
                                />
                                <label
                                    for="fileInputTwo"
                                    class="px-4 py-2 bg-green-500 text-black text-sm font-semibold rounded cursor-pointer hover:bg-opacity-80 transition"
                                >
                                    Upload File
                                </label>
                                    
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-grow p-6 justify-center flex-col w-full items-center">
                        {error && <div className="text-sm text-red-500 text-center mb-auto flex items-center justify-center w-full">{error}</div>}
                        {isLoading && <div className="text-sm text-white text-center mb-auto flex items-center justify-center w-full gap-1">
                            <div className="text-2xl text-green-400 animate-spin"><LuLoaderCircle/></div>Uploading your song...
                        </div>}
                        <button onClick={() => {
                            uploadSong(thumbnail,name,track)
                        }} className={`text-black font-semibold bg-white px-6 py-3 h-fit mt-auto rounded-full hover:bg-opacity-90 transition-all hover:scale-105 max-w-[160px] ${isLoading ? "cursor-progress" : "cursor-pointer"}`
                        }
                        disabled={isLoading}
                        >Upload Song</button>
                    </div>
                    
                </div>
            </div>
        
        </div>
    );
}
 
export default Upload;