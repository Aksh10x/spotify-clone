import { useCookies } from "react-cookie";
import ArtistCard from "../components/artistCard";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import SongCard from "../components/songCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {

    const [cookie] = useCookies(["token"])
    const navigate = useNavigate()

    useEffect(() => {
        if(!cookie.token){
            navigate("/signup")
        }
    },[])


    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Navbar/>
            <div className="w-full h-[calc(100vh-60px)] text-black bg-black relative p-2 pt-0 flex gap-2">
                <Sidebar/>
                <div className="w-full h-[calc(100%-75px)] bg-white bg-opacity-5 rounded-lg p-6 flex gap-2 flex-col overflow-auto scrollbar-hide">

                    <div className="space-y-3 h-fit overflow-scroll scrollbar-hide flex-nowrap min-h-fit">
                        <div className="text-white font-semibold text-xl">Popular Artists</div>
                        <div className="seciton flex gap-2 h-fit overflow-x-auto scrollbar-hide shadow-inner">
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                        </div>
                    </div>

                    <div className="space-y-3 h-fit overflow-scroll scrollbar-hide flex-nowrap min-h-fit">
                        <div className="text-white font-semibold text-xl">Popular Artists</div>
                        <div className="seciton flex gap-2 h-fit overflow-x-auto scrollbar-hide shadow-inner">
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                        </div>
                    </div>

                    <div className="space-y-3 h-fit overflow-scroll scrollbar-hide flex-nowrap min-h-fit">
                        <div className="text-white font-semibold text-xl">Popular Artists</div>
                        <div className="seciton flex gap-2 h-fit overflow-x-auto scrollbar-hide shadow-inner">
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                            <ArtistCard/>
                        </div>
                    </div>

                </div>
            </div>
        
        </div>
    );
}
 
export default Home;