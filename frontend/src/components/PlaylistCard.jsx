import { IoIosPlay } from "react-icons/io";
import { PiMusicNotesSimple } from "react-icons/pi";
import { Link } from "react-router-dom";

const PlaylistCard = ({image,name,owner,id}) => {
    return (
        <Link to={`/playlist/${id}`} className="min-w-[190px] max-w-[190px] h-[45%] relative p-3 hover:bg-white/10 rounded-lg transition-all cursor-pointer group">
            <div className="h-[70%] w-full rounded-lg shadow-xl"> 
                {image ? 
                    <img src={image} className="rounded-lg h-full w-full"/>
                    :
                    <div className="w-full h-full flex justify-center items-center text-7xl bg-white/5 rounded-md  text-white/60"><PiMusicNotesSimple /></div>
                }
            </div>
            <div className="text-white text-lg mt-2 hover:underline truncate">{name || "Playlist"}</div>
            <div className="text-white/60 text-sm mt-1">{"By " + (owner || "User")}</div>
            <div className="absolute text-3xl w-12 h-12 flex justify-center items-center right-4 top-[50%] bg-green-500 text-gray-950 rounded-full shadow-xl text-opacity-0 group-hover:text-opacity-100 bg-opacity-0 group-hover:bg-opacity-100 transition-all pl-1"><IoIosPlay /></div>
        </Link>
    );
}
 
export default PlaylistCard;