import { GoPlus } from "react-icons/go";
import { SiBookstack } from "react-icons/si";
import Library from "./library";



const Sidebar = () => {
    return (
        <div className="absolute left-2 lg:w-[23%] 2xl:w-[17%] md:w-[23%] sm:w-[23%] bg-white/5 rounded-lg h-[calc(100%-144px)]">
            <div className="flex text-white/35 w-full hover:text-white shadow-2xl shadow-black-40 rounded-t-lg transition font-semibold items-center text-xl justify-between py-4 px-4 h-[12%]">
                <div className="flex items-center gap-2 md:text-sm lg:text-2xl"><span className="lg:text-2xl md:text-sm"><SiBookstack/></span>Your Library</div>
            </div>

            <Library/>
        </div>
    );
}
 
export default Sidebar;