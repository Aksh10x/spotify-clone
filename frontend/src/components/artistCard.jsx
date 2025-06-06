import { FaCirclePlay } from "react-icons/fa6";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { SearchContext } from "../utils/searchContext";
import { useContext } from "react";

const ArtistCard = ({ id, name, avatar }) => {
    const { inSearch, setInSearch } = useContext(SearchContext);

    if (name) {
        return (
            <Link
                to={"/profile/" + id}
                onClick={() => setInSearch(false)}
                className="flex-shrink-0 w-[185px] h-[250px] relative p-6 bg-black bg-opacity-15 hover:bg-white rounded-lg hover:bg-opacity-15 transition-all cursor-pointer group"
            >
                <div className="h-[70%] w-full">
                    {avatar ? (
                        <img
                            src={avatar}
                            className="rounded-full h-full w-full object-cover object-center"
                        />
                    ) : (
                        <div className="rounded-full w-full h-full bg-white/15 flex justify-center items-center text-[100px] text-white/40">
                            <AiOutlineUser />
                        </div>
                    )}
                </div>
                <div className="text-white text-base mt-2">{name}</div>
                <div className="text-white text-opacity-25 text-sm mt-1">Artist</div>
                <div className="absolute right-4 top-[50%] text-green-500 bg-gray-950 text-5xl rounded-full shadow-xl text-opacity-0 group-hover:text-opacity-100 bg-opacity-0 group-hover:bg-opacity-100 transition-all">
                    <FaCirclePlay />
                </div>
            </Link>
        );
    }

    // Loading skeleton (non-clickable)
    return (
        <div className="flex-shrink-0 w-[185px] h-[250px] relative p-6 bg-black bg-opacity-15 rounded-lg animate-pulse">
            <div className="h-[70%] w-full">
                <div className="rounded-full w-full h-full bg-white/15 flex justify-center items-center" />
            </div>
            <div className="bg-white/40 w-[65%] h-[10px] mt-2 rounded-md"></div>
            <div className="bg-white/25 w-[30%] h-[6px] mt-1 rounded-md"></div>
            <div className="absolute right-4 top-[50%] text-green-500 bg-gray-950 text-5xl rounded-full shadow-xl text-opacity-0 bg-opacity-0 transition-all">
                <FaCirclePlay />
            </div>
        </div>
    );
};

export default ArtistCard;
