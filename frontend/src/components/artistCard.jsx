import { FaCirclePlay } from "react-icons/fa6";

const ArtistCard = () => {
    return (
        <div className="min-w-[185px] h-[45%] relative p-6 bg-black bg-opacity-15 hover:bg-white rounded-lg hover:bg-opacity-15 transition-all cursor-pointer group">
            <div className="h-[70%] w-full"> 
                <img src="https://i.scdn.co/image/ab6761610000e5ebe926dd683e1700a6d65bd835" className="rounded-full"/>
            </div>
            <div className="text-white text-lg mt-2">Artist Name</div>
            <div className="text-white text-opacity-25 text-sm mt-1">Artist</div>
            <div className="absolute right-4 top-[50%] text-green-500 bg-gray-950 text-5xl rounded-full shadow-xl text-opacity-0 group-hover:text-opacity-100 bg-opacity-0 group-hover:bg-opacity-100 transition-all"><FaCirclePlay /></div>
        </div>
    );
}
 
export default ArtistCard;