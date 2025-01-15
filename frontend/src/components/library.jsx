import { useEffect, useState } from "react";
import { AuthenticatedGETReq } from "../utils/server.helpers";
import { PiMusicNotesSimple } from "react-icons/pi";
import { Link } from "react-router-dom";

const Library = () => {

    const [playlists, setPlaylists] = useState([])
    const [id,setId] = useState("")

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        setId(res.data._id)
    }

    const fetchPlaylists = async() => {
        const res = await AuthenticatedGETReq(`/playlist/user-playlists/${id}`)
        console.log(res)
        if(res.success){
            const plists = res.data
            setPlaylists(plists)
        }else{
            setPlaylists([])
        }
    }

    useEffect(() => {
        DataFetch()
    },[])

    useEffect(() => {
        fetchPlaylists()
    },[id])
    return (
        <div className="w-full h-[90%] rounded-b-lg text-white flex flex-grow max-w-[300px]">
            <div className="flex flex-col w-full p-[8px]">
                {playlists && playlists.length > 0 ? 
                    playlists.map((playlist) => (
                        <Link to={`/playlist/${playlist._id}`} className="w-full h-[65px] rounded-md flex p-[8px] hover:bg-white/10 gap-2  cursor-pointer">
                            {playlist.thumbnail ? 
                                <img src={playlist.thumbnail} className="h-full rounded-sm max-w-[50px]"/>
                                :
                                <div className="w-[50px] h-full flex justify-center items-center text-lg bg-white/5 rounded-sm  text-white/60"><PiMusicNotesSimple /></div>
                            }
                            <div className="flex flex-col justify-center items-start">
                                <div className="text-white text-sm truncate overflow-hidden text-ellipsis w-[200px]">
                                {playlist.name}
                                </div>
                                <div className="text-white/60 text-xs">{playlist.owner}</div>
                            </div>
                        </Link>
                    ))
                    :
                    <div></div>
                }
            </div>
        </div>
    );
}
 
export default Library;