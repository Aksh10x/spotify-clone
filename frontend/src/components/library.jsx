import { useContext, useEffect, useState } from "react";
import { AuthenticatedGETReq } from "../utils/server.helpers";
import { PiMusicNotesSimple } from "react-icons/pi";
import { Link } from "react-router-dom";
import { PlaylistContext } from "../utils/playlistContext"
import { SearchContext } from "../utils/searchContext";

const Library = () => {

    const [playlists, setPlaylists] = useState([])
    const [id,setId] = useState("")
    const [loading, setLoading] = useState(true);

    const {deleted, setDeleted} = useContext(PlaylistContext)
    const {inSearch, setInSearch} = useContext(SearchContext)

    async function DataFetch(){
        const res = await AuthenticatedGETReq("/user/get-user")
        setId(res.data._id)
    }

    const fetchPlaylists = async() => {
        setLoading(true)
        const res = await AuthenticatedGETReq(`/playlist/user-playlists/${id}`)
        if(res.success){
            const plists = res.data
            if(plists.length == 0){
              setLoading(false)
            }
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
    },[id,deleted])
    return (
        <div className="w-full h-[90%] rounded-lg text-white flex flex-grow overflow-x-hidden">
          <div className="flex flex-col w-full p-[8px] overflow-y-auto overflow-x-hidden scrollbar-hide max-h-[95%] rounded-lg">
            {playlists && playlists.length > 0 ? (
              playlists.map((playlist) => (
                <Link
                  onClick={() => setInSearch(false)}
                  to={`/playlist/${playlist._id}`}
                  key={playlist._id}
                  className="min-w-full flex-shrink xl:h-[75px] lg:h-[65px] rounded-md flex p-[8px] hover:bg-white/10 gap-2 cursor-pointer"
                >
                  {playlist.thumbnail ? (
                    <img
                      src={playlist.thumbnail} 
                      className="xl:h-[60px] xl:min-w-[60px] lg:h-[50px] lg:w-[50px] object-cover rounded-sm max-w-[50px] md:w-[30px] md:h-[30px] "
                    />
                  ) : (
                    <div className="xl:min-w-[60px] xl:min-h-[60px] lg:min-w-[50px] lg:min-h-[50px] md:min-w-[30px] md:min-h-[30px] h-full flex justify-center items-center text-lg bg-white/5 rounded-sm text-white/60">
                      <PiMusicNotesSimple />
                    </div>
                  )}
                  <div className="flex flex-col justify-center items-start max-w-full w-full">
                    <div className="text-white md:text-[9px] lg:text-sm truncate overflow-hidden text-ellipsis md:max-w-[60%]">
                      {"Playlist • " + playlist.name}
                    </div>
                    <div className="text-white/60 lg:text-xs md:text-[7px] md:-mt-1 xl:mt-1">{playlist.owner}</div>
                  </div>
                </Link>
              ))
            ) : (
              loading ? 
                (<>
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 h-[65px] rounded-md flex p-[8px] gap-2 animate-pulse bg-white/5 mb-2"
                  >
                    <div className="w-[50px] h-full bg-white/20 rounded-sm" />
                    <div className="flex flex-col justify-center gap-1 w-full">
                      <div className="w-[70%] h-[12px] bg-white/20 rounded" />
                      <div className="w-[40%] h-[10px] bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              </>) :
              <div className="w-full text-sm font-semibold flex justify-center items-center py-4">
                Your library is empty...
              </div>
              
            )}
          </div>
        </div>
      );
}
 
export default Library;