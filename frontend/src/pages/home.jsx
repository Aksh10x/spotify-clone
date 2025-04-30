import { useCookies } from "react-cookie";
import ArtistCard from "../components/artistCard";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import PlaylistCard from "../components/PlaylistCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthenticatedGETReq } from "../utils/server.helpers";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SearchContext, SearchProvider } from "../utils/searchContext";
import { SearchPage } from "../components/search_Page";

const Home = () => {

    const [cookie] = useCookies(["token"])
    const navigate = useNavigate()
    const [artists, setArtists] = useState([])
    const {inSearch,setInSearch,searchData,setSearchData} = useContext(SearchContext)

    useEffect(() => {
        if(!cookie.token){
            navigate("/signup")
        }
        getArtists();
    },[])

    const getArtists = async () => {
        if(artists.length === 0){
            const res = await AuthenticatedGETReq("/user/get-random-artists")
            if(res.success){
                setArtists(res.data);
            }
        }
    }

    useEffect(() => {
        if(searchData.length==0){setInSearch(false)}
    },[searchData])




    return (
        <div className="absolute lg:w-[75.5%] md:w-[75%] sm:w-[75%] 2xl:w-[82%] right-0 overflow-hidden h-[calc(100%-75px)] flex justify-center bg-white bg-opacity-5">
            
            <div className="w-full h-[calc(100vh-68px)] max-w-[2000px] text-black bg-black relative  pt-0 flex gap-2">
                
                <div className="w-full h-[calc(100%-75px)] bg-white bg-opacity-5 rounded-lg p-6 flex gap-2 flex-col overflow-auto custom-scrollbar">

                    {
                        inSearch ? 
                        <div className=""><SearchPage/></div>
                        :
                        <>
                        <div className="space-y-3 h-fit overflow-scroll scrollbar-hide flex-nowrap min-h-fit">
                        <div className="text-white font-semibold text-xl">Popular Artists</div>
                        <div className="seciton flex gap-2 h-fit overflow-x-auto scrollbar-hide shadow-inner">
                            {artists.length === 0 ?
                                [...Array(10)].map((_, index) => (
                                    <ArtistCard key={index}/>
                                )) 
                                :
                                artists.map((artist, index) => (
                                    <ArtistCard name={artist.firstName + " " + artist.secondName} avatar={artist.avatar} key={index}/>
                                ))
                            }
                        </div>
                        </div>

                        <div className="space-y-3 h-fit overflow-scroll scrollbar-hide flex-nowrap min-h-fit">
                            <div className="text-white font-semibold text-xl">Summer Hits</div>
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
                            <div className="text-white font-semibold text-xl">Popular Podcasts</div>
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

                        
                        <div className="w-full h-[0.6px] bg-white/20 flex-shrink-0 rounded mt-8"></div>
                        <div className="flex justify-center items-center pt-6 pb-4 gap-2">
                            <div className="text-white/60 text-base">Made by Aksh10x</div>
                            <a target="_blank" 
                            rel="noopener noreferrer" 
                            href="https://github.com/Aksh10x" className="text-white text-2xl flex items-center"><FaGithub /></a>
                            <a target="_blank" 
                            rel="noopener noreferrer" 
                            href="https://www.linkedin.com/in/akshath-surwase-867842274/"
                            className="text-white text-2xl flex items-center"><FaLinkedin /></a>
                        </div> 
                    </>
                    }
                </div>
                
            </div>
        
        </div>
    );
}

 
export default Home;