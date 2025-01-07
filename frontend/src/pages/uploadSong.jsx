import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FaSpotify } from "react-icons/fa";

const Upload = () => {
    return (
        <div className="w-full h-screen overflow-hidden">
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
                                ></input>
                            </div>

                        </div>

                        <div className="flex justify-between w-[300px]">
                            <div className="flex flex-col gap-1 w-fit mt-4">
                                <div className="text-xs font-semibold">Thumbnail</div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    class="hidden"
                                />
                                <label
                                    for="fileInput"
                                    class="px-4 py-2 bg-green-500 text-black text-sm font-semibold rounded cursor-pointer hover:bg-opacity-80 transition"
                                >
                                    Upload File
                                </label>
                                    
                            </div>

                            <div className="flex flex-col gap-1 w-fit mt-4">
                                <div className="text-xs font-semibold">Audio Track</div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    class="hidden"
                                />
                                <label
                                    for="fileInput"
                                    class="px-4 py-2 bg-green-500 text-black text-sm font-semibold rounded cursor-pointer hover:bg-opacity-80 transition"
                                >
                                    Upload File
                                </label>
                                    
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-grow">
                        <button className="text-black font-semibold bg-white px-6 py-3 h-fit mt-auto rounded-full hover:bg-opacity-90 transition-all hover:scale-105">Upload Song</button>
                    </div>
                    
                </div>
            </div>
        
        </div>
    );
}
 
export default Upload;