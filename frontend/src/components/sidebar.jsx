import { GoPlus } from "react-icons/go";
import { SiBookstack } from "react-icons/si";
import Library from "./library";



const Sidebar = () => {
    return (
        <div className="sticky left-0 w-[30%] min-w-[300px] bg-white bg-opacity-5 rounded-lg h-[calc(100%-75px)]">
            <div className="flex text-white/35 hover:text-white transition font-semibold items-center text-xl justify-between py-4 px-4 h-[12%] shadow-lg">
                <div className="flex items-center gap-2"><span className="text-2xl"><SiBookstack/></span>Your Library</div>
            </div>

            <Library/>
        </div>
    );
}
 
export default Sidebar;