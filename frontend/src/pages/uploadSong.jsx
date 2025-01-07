import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Upload = () => {
    return (
        <div className="w-full h-screen overflow-hidden">
            <div className="w-full h-full text-black bg-black relative pt-0 flex">
                <div className="w-full h-[100%] bg-white bg-opacity-10 p-6 flex gap-2 flex-col overflow-auto scrollbar-hide">
                    <Link to={"/profile"} className="text-white text-opacity-40 text-4xl font-semibold
                    hover:scale-105 hover:text-white transition w-fit flex absolute"
                    >
                        <MdOutlineKeyboardArrowLeft /> 
                    </Link>
                    
                </div>
            </div>
        
        </div>
    );
}
 
export default Upload;