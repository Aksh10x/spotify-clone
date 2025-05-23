import { FaCirclePlay } from "react-icons/fa6";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SearchContext } from "../utils/searchContext";

const ProfileCard = ({ id, name, avatar }) => {
    const { inSearch, setInSearch } = useContext(SearchContext);

    // Show actual profile card with link
    if (name) {
        return (
            <Link
                to={"/profile/" + id}
                onClick={() => { setInSearch(false) }}
                className="flex-shrink-0 w-[185px] h-[250px] relative p-6 bg-black bg-opacity-15 hover:bg-white rounded-lg hover:bg-opacity-15 transition-all cursor-pointer group"
            >
                <div className="h-[70%] w-full">
                    {avatar ? (
                        <img src={avatar} className="rounded-full h-full w-full object-cover object-center" />
                    ) : (
                        <div className="rounded-full w-full h-full bg-white/15 flex justify-center items-center text-[100px] text-white/40">
                            <AiOutlineUser />
                        </div>
                    )}
                </div>
                <div className="text-white text-base mt-2">{name}</div>
                <div className="text-white text-opacity-25 text-sm mt-1">Profile</div>
            </Link>
        );
    }

    // Show loading skeleton without link
    return (
        <div className="flex-shrink-0 w-[185px] h-[250px] relative p-6 bg-black bg-opacity-15 rounded-lg animate-pulse">
            <div className="h-[70%] w-full">
                <div className="rounded-full w-full h-full bg-white/15 flex justify-center items-center" />
            </div>
            <div className="bg-white/40 w-[65%] h-[10px] mt-2 rounded-md"></div>
            <div className="bg-white/25 w-[30%] h-[6px] mt-1 rounded-md"></div>
        </div>
    );
};

export default ProfileCard;
