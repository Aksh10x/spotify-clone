import { useContext, useState } from "react"
import { useEffect } from "react"
import { AuthenticatedGETReq } from "../utils/server.helpers"
import { SearchContext } from "../utils/searchContext"
import HorizontalCard from "./songHorizontalCard"
import ArtistCard from "./artistCard"
import ProfileCard from "./profileCard"

export const SearchPage = () => {
    const {searchData} = useContext(SearchContext)
    const [searchedSongs,setSearchedSongs] = useState([])
    const [searchedArtists,setSearchedArtists] = useState([])
    const [searchedProfiles,setSearchedProfiles] = useState([])

    const SearchQuery = async(searchData) => {
        if(searchData.length === 0) return
        const res = await AuthenticatedGETReq(`/user/search?q=${searchData}`)
        if(res.success){
            setSearchedSongs(res.data.searchedSongs)
            setSearchedArtists(res.data.searchedArtists)
            setSearchedProfiles(res.data.searchedProfiles)
        }else{
            alert("Error loading search results.")
        }
    }

    

    useEffect ( () => {
        SearchQuery(searchData)
    },[searchData])

    return(
        <div className="w-full h-full text-5xl flex flex-col gap-2">
            <div className="flex flex-col gap-2 w-full scrollbar-hide">
                <div className="text-2xl font-semibold text-white">Songs</div>
                <div className="flex flex-col w-full max-h-[200px] overflow-y-auto custom-scrollbar">
                    {searchedSongs.length > 0 ? (
                        searchedSongs?.map((song,index) => (
                            <HorizontalCard 
                                songId={song._id}
                                name={song.name} 
                                artistFirstName={song.artistFirstName}
                                artistSecondName={song.artistSecondName}
                                thumbnail={song.thumbnail}
                                duration={song.duration}
                                index={index}
                                hlsUrl={song.hlsUrl}
                            />
                        )
                    ))
                    :
                    <div className="text-white/40 text-lg">
                        No Results...
                    </div>
                    } 
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full overflow-x-auto scrollbar-hide">
                <div className="text-2xl font-semibold text-white overflow-x-auto scrollbar-hide">Artists</div>
                <div className="flex w-full overflow-x-auto scrollbar-hide gap-2">
                    {searchedArtists.length > 0 ? (
                        searchedArtists?.map((artist,index) => (
                            <ArtistCard id={artist._id} name={artist.firstName + " " + artist.secondName} avatar={artist.avatar} key={index}/>
                        )
                    ))
                    :
                    <div className="text-white/40 text-lg">
                        No Results...
                    </div>
                    } 
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full overflow-x-auto scrollbar-hide">
                <div className="text-2xl font-semibold text-white">Profiles</div>
                <div className="flex w-full overflow-x-auto scrollbar-hide gap-2">
                    {searchedProfiles.length > 0 ? (
                        searchedProfiles?.map((profile,index) => (
                            <ProfileCard id={profile._id} name={profile.firstName + " " + profile.secondName} avatar={profile.avatar} key={index}/>
                        )
                    ))
                    :
                    <div className="text-white/40 text-lg">
                        No Results...
                    </div>
                    } 
                </div>
            </div>
        </div>
    )
}