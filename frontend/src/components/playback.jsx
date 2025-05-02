import { useContext, useEffect, useRef, useState } from "react";
import { SongContext } from "../utils/songContext";
import { IoIosPlayCircle } from "react-icons/io";
import { Howl } from "howler";
import { RiPauseCircleFill } from "react-icons/ri";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import {
  IoRepeatOutline,
  IoShuffleOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import { AuthenticatedGETReq, getAudioDurationFromURL } from "../utils/server.helpers";
import { Link } from "react-router-dom";

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
  const [volume, setVolume] = useState(1);
  const volumeRef = useRef();
  const seekRef = useRef();
  const [artistId, setArtistId] = useState(null);
  const [duration, setDuration] = useState("0:00");
  const [seekValue, setSeekValue] = useState(0);

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
      volume: volume,
      onend: () => {
        playNextSong();
      },
    });

    setSoundPlayed(sound);
    sound.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    getArtistId(playingId);
    fetchDuration();
    if (soundPlayed) {
      soundPlayed.stop();
      soundPlayed.unload();
    }

    if (songTrack) {
      playSong(songTrack);
    }
  }, [songTrack]);

  useEffect(() => {
    let raf;
    const updateSeek = () => {
      if (soundPlayed && isPlaying) {
        const current = soundPlayed.seek();
        const total = soundPlayed.duration();
        if (typeof current === "number" && typeof total === "number") {
          setSeekValue(current / total);
        }
        raf = requestAnimationFrame(updateSeek);
      }
    };
    if (isPlaying) {
      raf = requestAnimationFrame(updateSeek);
    }
    return () => cancelAnimationFrame(raf);
  }, [soundPlayed, isPlaying]);

  useEffect(() => {
    if (seekRef.current) {
      const percent = (parseFloat(seekRef.current.value) / parseFloat(seekRef.current.max)) * 100;
      seekRef.current.style.setProperty('--seek-before-width', `${percent}%`);
    }
  }, [seekValue]);

  const playNextSong = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      if (shuffle) {
        let index;
        do {
          index = Math.floor(Math.random() * queue.length);
        } while (index === currentIndex && queue.length > 1);
        const nextSong = queue[index];
        if (nextSong) {
          setSongFromQueue(index, nextSong);
        }
      } else {
        const nextSong = queue[currentIndex + 1];
        if (nextSong) {
          setSongFromQueue(currentIndex + 1, nextSong);
        }
      }
    } else if (currentIndex === queue.length - 1 && shuffle) {
      let index;
      do {
        index = Math.floor(Math.random() * queue.length);
      } while (index === currentIndex && queue.length > 1);
      const nextSong = queue[index];
      if (nextSong) {
        setSongFromQueue(index, nextSong);
      }
    } else if (currentIndex === queue.length - 1 && repeat) {
      const nextSong = queue[0];
      if (nextSong) {
        setSongFromQueue(0, nextSong);
      }
    }

    if (!queue || queue.length === 0) {
      stopPlayback();
    }
  };

  const playPrevSong = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevSong = queue[currentIndex - 1];
      if (prevSong) {
        setSongFromQueue(currentIndex - 1, prevSong);
      }
    } else if (repeat && currentIndex === 0) {
      const prevSong = queue[queue.length - 1];
      if (prevSong) {
        setSongFromQueue(queue.length - 1, prevSong);
      }
    }
  };

  const setSongFromQueue = (index, song) => {
    setPlayingId(song._id);
    setSongName(song.name);
    setSongThumbnail(song.thumbnail);
    setSongTrack(song.track);
    setArtist(`${song.artistFirstName} ${song.artistSecondName}`);
    setCurrentIndex(index);
  };

  const stopPlayback = () => {
    if (soundPlayed) {
      soundPlayed.stop();
      soundPlayed.unload();
    }
    setSoundPlayed(null);
    setIsPlaying(false);
    setPlayingId(null);
    setSongName(null);
    setSongThumbnail(null);
    setSongTrack(null);
    setArtist(null);
    setCurrentIndex(0);
    setSeekValue(0);
  };

  const getArtistId = async (playingId) => {
    const res = await AuthenticatedGETReq(`/song/whos-the-artist/${playingId}`);
    if (res.success) {
      setArtistId(res.data);
    }
  };

  const changeVolume = () => {
    const newVolume = parseFloat(volumeRef.current.value);
    const max = parseFloat(volumeRef.current.max);
    const percent = (newVolume / max) * 100;
    volumeRef.current.style.setProperty('--seek-before-width', `${percent}%`);
    setVolume(newVolume);
    if (soundPlayed) {
      soundPlayed.volume(newVolume);
    }
  };

  const fetchDuration = async () => {
    try {
      const durationInSeconds = await getAudioDurationFromURL(songTrack);
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      setDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    } catch (error) {
      console.error(error);
      setDuration("0:00");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentTime = soundPlayed ? soundPlayed.seek() : 0;

  return (
    <div className="h-[70px] bg-black w-full absolute bottom-0 text-white max-h-[14vh] px-4 pb-4 flex gap-3 mt-3 justify-between">
      {songName ? (
        <div className="flex justify-start items-center gap-3 w-1/4">
          <img src={songThumbnail} className="h-[57px] rounded-md max-w-[57px] w-full object-cover object-center" alt="Song Thumbnail" />
          <div className="flex flex-col justify-center items-start h-full">
            <p className="text-sm hover:underline cursor-pointer">{songName}</p>
            <Link to={`/profile/${artistId}`} className="text-xs text-white/60 hover:text-white hover:underline cursor-pointer">
              {artist}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-start items-center gap-3 w-1/4">
          <div className="h-full rounded-md bg-white/5 w-[55px]"></div>
          <div className="flex flex-col justify-center h-full">
            <p className="text-sm hover:underline cursor-pointer">--</p>
            <p className="text-xs text-white/60 hover:text-white hover:underline cursor-pointer">--</p>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center w-2/4">
        <div className="w-1/2 h-full justify-center gap-2 items-center flex">
          <button
            className={`relative right-3 text-2xl transition-all ${shuffle ? "text-green-500" : "text-white/40"}`}
            onClick={() => {
              if (repeat) setRepeat(false);
              setShuffle(prev => !prev);
            }}
          >
            <IoShuffleOutline />
          </button>
          <button onClick={playPrevSong} className="text-xl text-white/40 hover:text-white transition-all">
            <FaBackwardStep />
          </button>
          <button onClick={togglePlayback} className="text-4xl hover:scale-105 transition-all hover:text-white/90">
            {isPlaying ? <RiPauseCircleFill /> : <IoIosPlayCircle />}
          </button>
          <button onClick={playNextSong} className="text-xl text-white/40 hover:text-white transition-all">
            <FaForwardStep />
          </button>
          <button
            className={`relative left-3 text-2xl transition-all ${repeat ? "text-green-500" : "text-white/40"}`}
            onClick={() => {
              if (shuffle) setShuffle(false);
              setRepeat(prev => !prev);
            }}
          >
            <IoRepeatOutline />
          </button>
        </div>
        <div className="flex gap-2 justify-center items-center w-full relative">
        <p className="text-xs text-white/60">{formatTime(currentTime || 0)}</p>
        <div className="seekWrapper relative">
            <div className="seekBarBg"></div>
            <div
                className="seekBarFill"
                style={{ width: `${seekValue * 100}%` }}
            ></div>
            <input
                type="range"
                ref={seekRef}
                min="0"
                max="1"
                step="0.001"
                value={seekValue}
                onChange={(e) => {
                const newVal = parseFloat(e.target.value);
                setSeekValue(newVal);
                if (soundPlayed) {
                    const newTime = newVal * soundPlayed.duration();
                    soundPlayed.seek(newTime);
                }
                }}
                className="seekBar"
                disabled={!isPlaying}
            />
        </div>

            <p className="text-xs text-white/60">{duration}</p>
        </div>
      </div>

      <div className="w-1/4 h-full flex justify-end items-center px-6">
        <button
          className="transition-all text-white/40 text-2xl flex justify-center items-center mt-1 mr-2 hover:text-white"
          onClick={() => {
            const newVol = volume === 0 ? 1 : 0;
            volumeRef.current.value = newVol;
            setVolume(newVol);
            changeVolume();
          }}
        >
          {volume === 0 ? <IoVolumeMuteOutline /> : <IoVolumeHighOutline />}
        </button>
        <div className="relative">
          <input
            type="range"
            defaultValue={volume}
            min="0"
            max="1"
            step="0.01"
            ref={volumeRef}
            onChange={changeVolume}
            className="volumeBar"
          />
        </div>
      </div>
    </div>
  );
};

export default Playback;
