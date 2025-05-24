import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FaSpotify } from "react-icons/fa";
import { useState } from "react";
import { AuthenticatedPOSTFormReq } from "../utils/server.helpers";
import { LuLoaderCircle } from "react-icons/lu";

const Upload = () => {
    const [name, setName] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [track, setTrack] = useState(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    
    // Define size limits
    const MAX_THUMBNAIL_SIZE_MB = 5; // 5MB max for thumbnail
    const MAX_AUDIO_SIZE_MB = 15;    // 15MB max for audio
    
    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + " KB";
        }
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    const uploadSong = async(thumbnail, name, track) => {
        if (name.trim() === "") {
            setError("Track name is required");
            return;
        }
        
        if (!thumbnail) {
            setError("Thumbnail is required");
            return;
        }
        
        if (!track) {
            setError("Audio file is required");
            return;
        }
        
        const formData = new FormData();
        formData.append("thumbnail", thumbnail);
        formData.append("name", name);
        formData.append("track", track);

        setIsLoading(true);
        const res = await AuthenticatedPOSTFormReq("/song/create", formData);
        
        if (res.success) {
            setTimeout(() => {
                setIsLoading(false);
                navigate("/profile");
            });
        } else {
            setIsLoading(false);
            setError(res.message);
        }
    }

    return (
        <div className="w-full h-screen absolute top-0 left-0 overflow-hidden z-10">
            <div className="w-full h-full text-white bg-black relative pt-0 flex">
                <div className="w-full h-[100%] bg-white bg-opacity-10 p-6 flex gap-2 flex-col overflow-auto scrollbar-hide items-center justify-evenly">
                    <Link to={isLoading ? "#" : "/profile"}
                    className="text-white text-opacity-40 text-4xl font-semibold
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
                                <input className="w-[380px] px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[45px] transition hover:border-white"
                                type="text"
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError("");
                                }}
                                ></input>
                            </div>
                        </div>

                        <div className="flex justify-between w-[400px]">
                            <div className="flex flex-col gap-1 w-[200px] mt-4">
                                <div className="text-xs font-semibold">
                                    Thumbnail <span className="text-white/60">(Max {MAX_THUMBNAIL_SIZE_MB}MB)</span>
                                </div>
                                <input
                                    type="file"
                                    id="fileInputOne"
                                    className="hidden"
                                    onChange={(e) => {
                                        setError("");
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        
                                        // Check file type
                                        const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];
                                        if (!validFileTypes.includes(file.type)) {
                                            setError("Please upload a valid image (JPEG, JPG, or PNG)");
                                            return;
                                        }
                                        
                                        // Check file size
                                        const fileSizeMB = file.size / (1024 * 1024);
                                        if (fileSizeMB > MAX_THUMBNAIL_SIZE_MB) {
                                            setError(`Thumbnail exceeds maximum size of ${MAX_THUMBNAIL_SIZE_MB}MB (Current: ${formatFileSize(file.size)})`);
                                            return;
                                        }
                                        
                                        setThumbnail(file);
                                    }}
                                />
                                <label
                                    htmlFor="fileInputOne"
                                    className="px-4 py-2 w-fit bg-green-500 text-black text-sm font-semibold rounded cursor-pointer hover:bg-opacity-80 transition"
                                >
                                    Upload File
                                </label>
                                {thumbnail && (
                                    <div className="text-xs text-green-400 mt-1 max-w-[150px] overflow-hidden break-words">
                                        {thumbnail.name} ({formatFileSize(thumbnail.size)})
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 w-[200px] mt-4">
                                <div className="text-xs font-semibold">
                                    Audio Track <span className="text-white/60">(Max {MAX_AUDIO_SIZE_MB}MB)</span>
                                </div>
                                <input
                                    type="file"
                                    id="fileInputTwo"
                                    className="hidden"
                                    onChange={(e) => {
                                        setError("");
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        
                                        // Check file type
                                        const validFileTypes = ["audio/mpeg"];
                                        if (!validFileTypes.includes(file.type)) {
                                            setError("Please upload a valid audio track (MP3 only)");
                                            return;
                                        }
                                        
                                        // Check file size
                                        const fileSizeMB = file.size / (1024 * 1024);
                                        if (fileSizeMB > MAX_AUDIO_SIZE_MB) {
                                            setError(`Audio file exceeds maximum size of ${MAX_AUDIO_SIZE_MB}MB (Current: ${formatFileSize(file.size)})`);
                                            return;
                                        }
                                        
                                        setTrack(file);
                                    }}
                                />
                                <label
                                    htmlFor="fileInputTwo"
                                    className="px-4 py-2 w-fit bg-green-500 text-black text-sm font-semibold rounded cursor-pointer hover:bg-opacity-80 transition"
                                >
                                    Upload File
                                </label>
                                {track && (
                                    <div className="text-xs text-green-400 mt-1 max-w-[150px] overflow-hidden break-words">
                                        {track.name} ({formatFileSize(track.size)})
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-grow p-6 justify-center flex-col w-full items-center">
                        {error && <div className="text-sm text-red-500 text-center mb-auto flex items-center justify-center w-full">{error}</div>}
                        {isLoading && <div className="text-sm text-white text-center mb-auto flex items-center justify-center w-full gap-1">
                            <div className="text-2xl text-green-400 animate-spin"><LuLoaderCircle/></div>Uploading your song...
                        </div>}
                        <button onClick={() => {
                            uploadSong(thumbnail, name, track);
                        }} className={`text-black font-semibold bg-white px-6 py-3 h-fit mt-auto rounded-full hover:bg-opacity-90 transition-all hover:scale-105 max-w-[160px] ${isLoading ? "cursor-progress" : "cursor-pointer"}`}
                        disabled={isLoading || !thumbnail || !track || name.trim() === ""}
                        >Upload Song</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Upload;