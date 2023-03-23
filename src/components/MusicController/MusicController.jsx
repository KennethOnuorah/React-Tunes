import { useRef, useReducer } from 'react'
import { useUpdateEffect } from 'react-use'
import Marquee from 'react-fast-marquee'

import * as localforage from 'localforage'

import { songReducer, initialSongState } from '../../reducers/SongReducer'
import { controlsReducer, initialControlsState } from '../../reducers/ControlsReducer'

import getConvertedTime from '../../utils/getConvertedTime'
import useArrayMerge from '../../utils/useArrayMerge'
import useShuffle from '../../utils/useShuffle'

import {
  BsPlayFill as Play, BsPauseFill as Pause, 
  BsFillSkipEndFill as SkipForward, BsFillSkipStartFill as SkipBack,
} from "react-icons/bs"
import {
  TbVolumeOff as VolumeMute, TbVolume2 as VolumeSome, TbVolume as VolumeFull,
  TbArrowsShuffle as Shuffle, TbArrowsRight as Consecutive,
  TbSquare1 as PlayOnce, TbRepeat as LoopPlaylist, TbRepeatOnce as LoopSong,
} from "react-icons/tb"

import "./MusicController.css"

const MusicController = (props) => {
  const [song, songDispatch] = useReducer(songReducer, initialSongState)
  const [controls, controlsDispatch] = useReducer(controlsReducer, initialControlsState)
  const onLastSong = controls.shuffleEnabled ? 
    controls.queues.shuffled.indexOf(song.currentSong) == controls.queues.shuffled.length - 1 :
    controls.queues.ordered.indexOf(song.currentSong) == controls.queues.ordered.length - 1
  const audioRef = useRef()
  const currentPlaylistCoverRef = useRef("../src/images/default_album_cover.png")
  const playbackBarRef = useRef()
  const volumeAdjusterRef = useRef()
  const volumeLevelBeforeMute = useRef(1)

  useUpdateEffect(() => {
    startNewQueue(props.startedPlaylist)
  }, [props.startedPlaylist])

  const startNewQueue = async(playlistName) => {
    if(playlistName == "") return
    console.log("STARTING PLAYLIST:", playlistName)
    songDispatch({type: "set_current_playlist", playlist: playlistName})
    const details = await localforage.getItem("_playlist_details")
    const ordered = useArrayMerge([details[playlistName]["allArtists"], details[playlistName]["allSongs"]], " - ")
    const shuffled = useShuffle([...ordered])
    const firstSong = !controls.shuffleEnabled ? ordered[0] : shuffled[0]
    controlsDispatch({type: "update_queues", queues: {ordered: [...ordered], shuffled: [...shuffled]}})
    songDispatch({type: "set_current_song", song: firstSong})
    controlsDispatch({type: "set_paused", isPaused: false})
    currentPlaylistCoverRef.current = details[playlistName]["coverArt"]
    audioRef.current.src = await localforage.getItem(`${playlistName}: ${firstSong}`)
    console.log("Now playing song:", firstSong)
    audioRef.current.play()
  }

  const handleQueueEnd = async() => {
    if(controls.currentPlayMode == "Loop playlist"){
      const reshuffled = useShuffle([...controls.queues.ordered])
      const firstSong = controls.shuffleEnabled ? reshuffled[0] : queues.ordered[0]
      controlsDispatch({type: "update_queues", queues: {...controls.queues, shuffled: [...reshuffled]}})
      songDispatch({type: "set_current_song", song: firstSong})
      audioRef.current.src = await localforage.getItem(`${song.currentPlaylist}: ${firstSong}`)
      audioRef.current.currentTime = 0
      console.log("Now playing song:", firstSong)
      audioRef.current.play()
    }else{
      audioRef.current.pause()
      controlsDispatch({type: "set_paused", isPaused: true})
    }
  }

  const onSongEnded = () => {
    if(controls.currentPlayMode == "Loop song"){
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }else{
      playNextSong()
    }
  }

  const playNextSong = async(playDirection="right") => {
    if(onLastSong){
      handleQueueEnd()
      return
    }
    const newSong = !controls.shuffleEnabled ? 
      controls.queues.ordered[playDirection.toLowerCase() == "right" ? 
        controls.queues.ordered.indexOf(song.currentSong) + 1 : controls.queues.ordered.indexOf(song.currentSong) - 1] :
      controls.queues.shuffled[playDirection.toLowerCase() == "right" ? 
        controls.queues.shuffled.indexOf(song.currentSong) + 1 : controls.queues.shuffled.indexOf(song.currentSong) - 1]
    songDispatch({type: "set_current_song", song: newSong})
    audioRef.current.src = await localforage.getItem(`${song.currentPlaylist}: ${newSong}`)
    console.log(`Now playing ${playDirection ? "next" : "previous"} song:`, newSong)
    controlsDispatch({type: "set_paused", isPaused: false})
    audioRef.current.play()
  }

  const skipCurrentSong = (skipDirection="right") => {
    switch (skipDirection.toLowerCase()) {
      case "right":
        console.log(`Skipping song: ${song.currentSong}`)
        playNextSong(skipDirection)
        break
      case "left":
        if(audioRef.current.currentTime > 3 
          || controls.queues.ordered.indexOf(song.currentSong) == 0
          || controls.queues.shuffled.indexOf(song.currentSong) == 0){
          audioRef.current.currentTime = 0
        }else{
          playNextSong(skipDirection)
        }
        break
      default:
        console.log(`"${skipDirection}" is not a valid skip direction.`)
        break
    }
  }

  return (
    <footer className={`musicController${props.darkTheme ? ' darkThemeMusicController' : ''}`}>
      <audio 
        ref={audioRef}
        onLoadedMetadata={(e) => songDispatch({
          type: "set_duration", duration: getConvertedTime(e.target.duration, true)
        })}
        onTimeUpdate={() => {
          playbackBarRef.current.value = !controls.playbackDragged ? 
            audioRef.current.currentTime : 
            playbackBarRef.current.value
          !controls.playbackDragged && songDispatch({
            type: "update_current_time", time: getConvertedTime(audioRef.current.currentTime, true)
          })
        }}
        onEnded={onSongEnded}
      />
      <div style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
        <img
          className='currentPlaylistCover'
          title={`${song.currentPlaylist !== "" ? song.currentPlaylist : "-"}`}
          src={currentPlaylistCoverRef.current} width={50} height={50}
        />
        <div className={`controllerLeftContainer${props.darkTheme ? ' darkThemeLeftContainer' : ''}`}>
          <Marquee
            className='songMarquee'
            speed={(song.currentSong !== "" && song.currentSong.length > 60) ? 25 : 0} 
            gradientColor={"white"} 
            delay={2}
            style={{
              maxWidth: "437.833px"
            }}
          >
            <div className="currentSong">
              {song.currentSong !== "" ? song.currentSong : '-'}
            </div>
            {
              (song.currentSong !== "" && song.currentSong.length > 35) ? 
                <div style={{opacity: "0"}}>-------------------------</div> : 
                ""
            }
          </Marquee>
          <div className='mainControls'>
            <div className="controlBtns">
              <button 
                title='Skip back'
                onClick={() => skipCurrentSong("left")}
              >
                <SkipBack size={15}  color={props.darkTheme ? 'white' : 'black'}/>
              </button>
              <button 
                title={
                  audioRef.current &&
                  !audioRef.current.paused ? "Pause" : "Play"
                }
                onClick={() => {
                  if(!audioRef.current) return
                  if(!audioRef.current.paused) {
                    audioRef.current.pause()
                    controlsDispatch({type: "set_paused", isPaused: true})
                  }else{
                    audioRef.current.play()
                    controlsDispatch({type: "set_paused", isPaused: false})
                  }
                }}
              >
                {
                  controls.paused ?
                    <Play size={25} color={props.darkTheme ? 'white' : 'black'}/> : 
                    <Pause size={25} color={props.darkTheme ? 'white' : 'black'}/>
                }
              </button>
              <button 
                title='Skip forward'
                onClick={() => skipCurrentSong("right")}
              >
                <SkipForward size={15} color={props.darkTheme ? 'white' : 'black'}/>
              </button>
            </div>
            <div className='songTime'>
              <div style={{ width: "30px", textAlign: "right" }}>
                {song.currentTime}
              </div>
              <input 
                className='playbackBar' 
                ref={playbackBarRef}
                type="range" 
                defaultValue={0}
                min={0} 
                max={Math.floor(audioRef.current ? audioRef.current.duration : 0)} 
                onMouseDown={() => controlsDispatch({type: "drag_playback", isPlaybackDragged: true})}
                onMouseUp={(e) => {
                  controlsDispatch({type: "drag_playback", isPlaybackDragged: false})
                  audioRef.current.currentTime = e.target.value
                }}
                onInput={(e) => controls.playbackDragged && songDispatch({
                  type: "update_current_time", time: getConvertedTime(e.target.value, true)
                })}
              />
              {song.duration}
            </div>
          </div> 
        </div>
      </div>
      <div className={`controllerRightContainer${props.darkTheme ? ' darkThemeRightContainer' : ''}`}>
        <div className="playModeControls">
          <button 
            className='shuffleBtn' 
            title={!controls.shuffleEnabled ? 'Enable shuffle' : "Disable shuffle"}
            onClick={() => controlsDispatch({type: "toggle_shuffle_mode"})}
          >
            {
              controls.shuffleEnabled ? 
                <Shuffle size={20} color={props.darkTheme ? 'white' : 'black'}/> :
                <Consecutive size={20} color={props.darkTheme ? 'white' : 'black'}/>
            }
          </button>
          <button 
            title={`${controls.currentPlayMode}`}
            onClick={() => controlsDispatch({type: "change_play_mode"})}
          >
            {
              controls.currentPlayMode == "No looping" ? 
                <PlayOnce size={20} color={props.darkTheme ? 'white' : 'black'}/> : 
                controls.currentPlayMode == "Loop playlist" ? 
                  <LoopPlaylist size={20} color={props.darkTheme ? 'white' : 'black'}/> : 
                  <LoopSong size={20} color={props.darkTheme ? 'white' : 'black'}/>
            }
          </button>
        </div>
        <div className="volumeControls">
          <button
            onClick={() => {
              controlsDispatch({
                type: "set_volume", volume: audioRef.current.volume > 0 ? 0 : volumeLevelBeforeMute.current
              })
              audioRef.current.volume = audioRef.current.volume > 0 ? 0 : volumeLevelBeforeMute.current
              vol.current.value = audioRef.current.volume
            }}
          >
            {
              controls.volume <= 0 ?
               <VolumeMute size={20} color={props.darkTheme ? "white" : "black"}/> :
               controls.volume < 1 ?
                <VolumeSome size={20} color={props.darkTheme ? "white" : "black"}/> :
                <VolumeFull size={20} color={props.darkTheme ? "white" : "black"}/>
            }
          </button>            
          <input 
            className='volumeAdjuster' 
            ref={volumeAdjusterRef}
            type="range" 
            min={0} 
            max={1}
            step={0.01}
            defaultValue={1}
            onInput={(e) => {
              audioRef.current.volume = e.target.value
              volumeLevelBeforeMute.current = e.target.value
              controlsDispatch({type: "set_volume", volume: audioRef.current.volume})
            }}
          />
        </div>
      </div>
    </footer>
  )
}

export default MusicController