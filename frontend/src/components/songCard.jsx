import { FaCirclePlay } from "react-icons/fa6";

const SongCard = ({image,name,artist}) => {
    return (
        <div className="min-w-[190px] max-w-[190px] h-[45%] relative p-4 bg-black bg-opacity-15 hover:bg-white rounded-lg hover:bg-opacity-15 transition-all cursor-pointer group">
            <div className="h-[70%] w-full rounded-lg shadow-xl"> 
                <img src={image} className="rounded-lg"/>
            </div>
            <div className="text-white font-semibold text-lg mt-2">{name}</div>
            <div className="text-white text-opacity-25 font-semibold text-sm mt-1">{artist}</div>
            <div className="absolute right-4 top-[50%] text-green-500 bg-gray-950 text-5xl rounded-full shadow-xl text-opacity-0 group-hover:text-opacity-100 bg-opacity-0 group-hover:bg-opacity-100 transition-all"><FaCirclePlay /></div>
        </div>
    );
}
 
export default SongCard;