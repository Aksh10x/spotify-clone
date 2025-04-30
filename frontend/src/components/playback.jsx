import { useContext, useEffect, useState } from "react";
import { SongContext } from "../utils/songContext";
import { IoIosPlayCircle } from "react-icons/io";
import { Howl } from "howler";
import { RiPauseCircleFill } from "react-icons/ri";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import { IoRepeatOutline, IoShuffleOutline } from "react-icons/io5";

const Playback = () => {
    const {
        playingId, setPlayingId,
        songName, setSongName,
        songThumbnail, setSongThumbnail,
        songTrack, setSongTrack,
        isPlaying, setIsPlaying,
        artist, setArtist,
        queue, setQueue,
        currentIndex, setCurrentIndex
    } = useContext(SongContext);

    const [soundPlayed, setSoundPlayed] = useState(null);
    const [repeat, setRepeat] = useState(false);
    const [shuffle, setShuffle] = useState(false);

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
            onend: () => {
                playNextSong();
            },
        });

        setSoundPlayed(sound);
        sound.play();
        setIsPlaying(true);

    };

    useEffect(() => {
        if (soundPlayed) {
            soundPlayed.stop();
            soundPlayed.unload();
        }

        if (songTrack) {
            playSong(songTrack);
        }
    }, [songTrack]);

    const playNextSong = () => {
        if(queue.length > 0 && currentIndex < queue.length - 1){
            const nextSong = queue[currentIndex+1];

            if(nextSong){
                setPlayingId(nextSong._id);
                setSongName(nextSong.name);
                setSongThumbnail(nextSong.thumbnail);
                setSongTrack(nextSong.track);
                setArtist(nextSong.artistFirstName + " " + nextSong.artistSecondName);
                setCurrentIndex(currentIndex + 1);
            }
        }

        if(currentIndex === queue.length - 1 && repeat){
            const nextSong = queue[0];

            if(nextSong){
                setPlayingId(nextSong._id);
                setSongName(nextSong.name);
                setSongThumbnail(nextSong.thumbnail);
                setSongTrack(nextSong.track);
                setArtist(nextSong.artistFirstName + " " + nextSong.artistSecondName);
                setCurrentIndex(0);
            }
        }

        if(queue.length==0){
            if(repeat){
                soundPlayed.seek(0);
                soundPlayed.play();
            }else{
                setSongTrack(null)
                setIsPlaying(false);
                setPlayingId(null);
            }

        }
    }

    const playPrevSong = () => {
        if(queue.length > 0 && currentIndex > 0){
            const prevSong = queue[currentIndex-1];

            if(prevSong){
                setPlayingId(prevSong._id);
                setSongName(prevSong.name);
                setSongThumbnail(prevSong.thumbnail);
                setSongTrack(prevSong.track);
                setArtist(prevSong.artistFirstName + " " + prevSong.artistSecondName);
                setCurrentIndex(currentIndex - 1);
            }
        }

        if(repeat && currentIndex === 0){
            const prevSong = queue[queue.length - 1];

            if(prevSong){
                setPlayingId(prevSong._id);
                setSongName(prevSong.name);
                setSongThumbnail(prevSong.thumbnail);
                setSongTrack(prevSong.track);
                setArtist(prevSong.artistFirstName + " " + prevSong.artistSecondName);
                setCurrentIndex(queue.length - 1);
            }
        }
    }

    return (
        <div className="h-[70px] bg-black w-full absolute bottom-0 text-white max-h-[14vh] px-4 pb-4 flex gap-3 mt-3">
            {songName ? 
            <div className="flex justify-start items-center gap-3 w-1/4">
                <img src={songThumbnail} className="h-[57px] rounded-md max-w-[57px] w-full" alt="Song Thumbnail" />
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

            <div className="w-1/2 h-full justify-center gap-3 items-center flex">
                <button className={`relative right-3 text-3xl transition-all ${shuffle ? "text-green-500" : "text-white/40"}`}
                onClick={() => {
                    if(repeat){
                        setRepeat(false);
                    }
                    setShuffle((prev) => !prev);
                }}
                ><IoShuffleOutline /></button>
                <button onClick={playPrevSong} className="text-2xl text-white/40"><FaBackwardStep /></button>
                <button onClick={togglePlayback} className="text-5xl">
                    {isPlaying ? <RiPauseCircleFill /> : <IoIosPlayCircle />}
                </button>
                <button onClick={playNextSong} className="text-2xl text-white/40"><FaForwardStep /></button>
                <button className={`relative left-3 text-3xl transition-all ${repeat ? "text-green-500" : "text-white/40"}`}
                onClick={() => {
                    if(shuffle){
                        setShuffle(false);
                    }
                    setRepeat((prev) => !prev);
                }}
                ><IoRepeatOutline /></button>
            </div>

            <div className="w-1/4 h-full"></div>
        </div>
    );
};

export default Playback;
