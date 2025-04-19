import { useContext, useEffect, useState } from "react";
import { SongContext } from "../utils/songContext";
import { IoIosPlayCircle } from "react-icons/io";
import { Howl } from "howler";
import { RiPauseCircleFill } from "react-icons/ri";

const Playback = () => {
    const {
        songName, setSongName,
        songThumbnail, setSongThumbnail,
        songTrack, setSongTrack,
        isPlaying, setIsPlaying,
        artist, setArtist,
    } = useContext(SongContext);

    const [soundPlayed, setSoundPlayed] = useState(null);

    const togglePlayback = () => {
        if (soundPlayed) {
            if (isPlaying) {
                soundPlayed.pause();
            } else {
                soundPlayed.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const playSong = (songSrc) => {
        if (soundPlayed) {
            soundPlayed.stop();
            soundPlayed.unload();
        }

        const sound = new Howl({
            src: [songSrc],
            html5: true,
        });

        setSoundPlayed(sound);
        sound.play();
        setIsPlaying(true);
    };

    useEffect(() => {
        if (songTrack) {
            playSong(songTrack);
        }
    }, [songTrack]);

    return (
        <div className="h-[70px] bg-black w-full absolute bottom-0 text-white max-h-[14vh] px-4 pb-4 flex gap-3 mt-3">
            {songName ? 
            <div className="flex justify-start items-center gap-3 w-1/4">
                <img src={songThumbnail} className="h-full rounded-md" alt="Song Thumbnail" />
                <div className="flex flex-col justify-center h-full">
                    <p className="text-sm hover:underline cursor-pointer">{songName}</p>
                    <p className="text-xs text-white/60 hover:text-white hover:underline cursor-pointer flex justify-center items-center">{artist}</p>
                </div>
            </div>
            :
            <div className="flex justify-start items-center gap-3 w-1/4">
                <div className="h-full rounded-md bg-white/5 w-[55px]"></div>
                <div className="flex flex-col justify-center h-full">
                    <p className="text-sm hover:underline cursor-pointer">--</p>
                    <p className="text-xs text-white/60 hover:text-white hover:underline cursor-pointer flex justify-center items-center">--</p>
                </div>
            </div>
            }

            <div className="w-1/2 h-full justify-center items-center flex">
                <button onClick={togglePlayback} className="text-5xl">
                    {isPlaying ? <RiPauseCircleFill /> : <IoIosPlayCircle />}
                </button>
            </div>

            <div className="w-1/4 h-full"></div>
        </div>
    );
};

export default Playback;
