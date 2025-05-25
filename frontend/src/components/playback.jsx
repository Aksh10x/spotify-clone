import { useContext, useEffect, useRef, useState } from "react";
import { SongContext } from "../utils/songContext";
import { IoIosPlayCircle } from "react-icons/io";
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
import Hls from "hls.js";

const Playback = () => {
  const {
    playingId, setPlayingId,
    songName, setSongName,
    songThumbnail, setSongThumbnail,
    songTrack, setSongTrack,
    songHlsUrl, setSongHlsUrl,
    isPlaying, setIsPlaying,
    artist, setArtist,
    queue, setQueue,
    currentIndex, setCurrentIndex
  } = useContext(SongContext);

  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(1);
  const volumeRef = useRef();
  const seekRef = useRef();
  const [artistId, setArtistId] = useState(null);
  const [duration, setDuration] = useState("0:00");
  const [seekValue, setSeekValue] = useState(0);
  const [hls, setHls] = useState(null);
  const audioRef = useRef(null);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playSong = (hlsUrl) => {
    if(seekRef.current){
      seekRef.current.style.setProperty('--seek-before-width', `0%`);
    }  
    
    if (hls) {
      hls.destroy();
      setHls(null);
    }
    
    if (!hlsUrl) {
      console.error("No HLS URL provided");
      return;
    }
    
    try {
      const url = new URL(hlsUrl);

      if (!url.hostname.includes('firebasestorage.googleapis.com')) {
        console.warn("URL may not be a Firebase Storage URL:", url.toString());
      }
    } catch (e) {
      console.error("Invalid URL format:", hlsUrl, e);
      return;
    }
    
    if (Hls.isSupported()) {
      const newHls = new Hls({
        debug: true,  // Enable debug logging
        xhrSetup: function(xhr) {
          // Set CORS headers for Firebase Storage
          xhr.withCredentials = false;
        }
      });
      
      newHls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Playback failed:", error);
          });
      });
      
      newHls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        
        if (data.details === 'manifestParsingError' && data.err) {
          console.error("Manifest parsing error details:", data.err.message);
          
        }
        
        if (data.fatal) {
          console.error("Fatal error occurred in HLS playback");
          
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            newHls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            newHls.recoverMediaError();
          } else {
            newHls.destroy();
            setHls(null);
            setIsPlaying(false);
          }
        }
      });
      
      // Now load the source
      newHls.loadSource(hlsUrl);
      newHls.attachMedia(audioRef.current);
      setHls(newHls);
      
    } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari which has native HLS support
      audioRef.current.src = hlsUrl;
      audioRef.current.addEventListener('loadedmetadata', () => {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Playback failed:", error);
          });
      });
    } else {
      console.error("HLS is not supported on this browser and no fallback is available");
    }
  };

  useEffect(() => {
    getArtistId(playingId);
 
    if (hls) {
      hls.destroy();
    }

    const currentSong = queue[currentIndex];
    if (currentSong && currentSong.hlsUrl) {
      playSong(currentSong.hlsUrl);
    } else if (songHlsUrl) {
      playSong(songHlsUrl);
    }
  }, [songHlsUrl, currentIndex, queue]);

  useEffect(() => {
    const handleEnded = () => playNextSong();
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioRef.current, queue, currentIndex]);  

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        if (!isNaN(current) && !isNaN(total)) {
          setSeekValue(current / total);
        }
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [audioRef.current]);

  useEffect(() => {
    const handleDurationChange = () => {
      if (audioRef.current && audioRef.current.duration) {
        const durationSec = audioRef.current.duration;
        const minutes = Math.floor(durationSec / 60);
        const seconds = Math.floor(durationSec % 60);
        setDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('durationchange', handleDurationChange);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('durationchange', handleDurationChange);
      }
    };
  }, [audioRef.current]);

  useEffect(() => {
    if (seekRef.current) {
      const percent = (parseFloat(seekRef.current.value) / parseFloat(seekRef.current.max)) * 100;
      seekRef.current.style.setProperty('--seek-before-width', `${percent}%`);
    }
  }, [seekValue]);

  const playNextSong = () => {
    if(seekRef.current){
    seekRef.current.style.setProperty('--seek-before-width', `0%`);
    }
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
    if(seekRef.current){
      seekRef.current.style.setProperty('--seek-before-width', `0%`);
    }  
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
    setSongHlsUrl(song.hlsUrl);
    setArtist(`${song.artistFirstName} ${song.artistSecondName}`);
    setCurrentIndex(index);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (hls) {
      hls.destroy();
      setHls(null);
    }
    
    setIsPlaying(false);
    setPlayingId(null);
    setSongName(null);
    setSongThumbnail(null);
    setSongTrack(null);
    setSongHlsUrl(null);
    setArtist(null);
    setCurrentIndex(0);
    setSeekValue(0);
  };

  const getArtistId = async (playingId) => {
    if (!playingId) return;
    
    const res = await AuthenticatedGETReq(`/song/whos-the-artist/${playingId}`);
    if (res.success) {
      setArtistId(res.data);
    }
  };

  const changeVolume = () => {
    if (!audioRef.current) return;
    
    const newVolume = parseFloat(volumeRef.current.value);
    const max = parseFloat(volumeRef.current.max);
    const percent = (newVolume / max) * 100;
    volumeRef.current.style.setProperty('--seek-before-width', `${percent}%`);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="h-[70px] bg-black w-full absolute bottom-0 text-white max-h-[14vh] px-4 pb-4 flex gap-3 mt-3 justify-between">
      <audio ref={audioRef} style={{ display: 'none' }} />
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
          <button onClick={togglePlayback}
          disabled={!songHlsUrl}
          className="text-4xl hover:scale-105 transition-all hover:text-white/90">
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
          <p className="text-xs text-white/60">
            {formatTime(audioRef.current?.currentTime || 0)}
          </p>
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
                if (!audioRef.current) return;
                
                const newVal = parseFloat(e.target.value);
                setSeekValue(newVal);
                const newTime = newVal * audioRef.current.duration;
                audioRef.current.currentTime = newTime;
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
            if (!audioRef.current) return;
            
            const newVol = volume === 0 ? 1 : 0;
            volumeRef.current.value = newVol;
            setVolume(newVol);
            audioRef.current.volume = newVol;
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