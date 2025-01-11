import { useContext, useEffect, useState } from "react";
import { getAudioDurationFromURL } from "../utils/server.helpers";
import { IoIosPlay } from "react-icons/io";
import { SongContext } from "../utils/songContext";

const HorizontalCard = ({index,thumbnail,name,artistFirstName,artistSecondName,trackUrl}) => {

    const [duration, setDuration] = useState("");

    const {
        songName, setSongName,
        songThumbnail, setSongThumbnail,
        songTrack,setSongTrack,
        isPlaying, setIsPlaying,
        artist, setArtist,
    } = useContext(SongContext)

    const fetchDuration = async () => {
        try {
          const durationInSeconds = await getAudioDurationFromURL(trackUrl);
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = Math.floor(durationInSeconds % 60);
          setDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        } catch (error) {
          console.error(error);
          setDuration("N/A"); // Fallback if duration cannot be determined
        }
    };

    useEffect(() => {
        if (trackUrl) {
          fetchDuration();
        }
    }, [trackUrl]);

    const playSong = (name,thumbnail,trackUrl,artistFirstName,artistSecondName) => {
        setSongName(name)
        setSongThumbnail(thumbnail)
        setSongTrack(trackUrl)
        setArtist(artistFirstName + " " + artistSecondName)

    }
    return (
        <div className="w-full text-white flex h-[60px] hover:bg-white/10 rounded-md items-center p-2 cursor-pointer mt-1 group">
            <div className="w-[5%] text-center text-white/60 group-hover:text-white relative">
                <div className="group-hover:hidden">{index +1}</div>
                <button className="group-hover:block hidden hover:flex justify-center items-center text-2xl absolute h-full -top-3 left-3"
                onClick={() => playSong(name,thumbnail,trackUrl,artistFirstName,artistSecondName)}
                ><IoIosPlay /></button>
            </div>
            <img src={thumbnail} className="w-10 h-10 rounded-sm"/>
            <div className="flex flex-col ml-4 flex-grow">
                <p className="text-white text-sm">{name}</p>    
            </div>
            <p className="text-white/60 hover:underline text-sm w-[25%] group-hover:text-white">{artistFirstName + " " + artistSecondName}</p>
            <p className="text-white/60 text-sm w-[15%] text-center group-hover:text-white">{duration}</p>
            
        </div>
    );
}
 
export default HorizontalCard;