import { useState, useEffect, useRef } from 'react'
import Marquee from 'react-fast-marquee'

import * as localforage from 'localforage'
import getConvertedTime from '../../utils/getConvertedTime'
import useArrayMerge from '../../utils/useArrayMerge'
import useShuffle from '../../utils/useShuffle'

import {
  BsPlayFill as Play,
  BsPause as Pause,
  BsFillSkipEndFill as SkipForward,
  BsFillSkipStartFill as SkipBack,
} from "react-icons/bs"
import {
  TbVolumeOff as VolumeMute,
  TbVolume2 as VolumeSoft,
  TbVolume as VolumeFull,
  TbArrowsShuffle as Shuffle,
  TbArrowsRight as Consecutive,
  TbSquare1 as PlayOnce,
  TbRepeat as LoopPlaylist,
  TbRepeatOnce as LoopSong,
} from "react-icons/tb"

import "./MusicController.css"

const MusicController = (props) => {
  const [currentPlaylist, setCurrentPlaylist] = useState("")
  const [currentSong, setCurrentSong] = useState("")
  const [songQueueOrdered, setSongQueueOrdered] = useState([])
  const [songQueueShuffled, setSongQueueShuffled] = useState([])
  const [currentPlayMode, setCurrentPlayMode] = useState("No repeats")
  const playModes = ["No repeats", "Repeat playlist", "Repeat song"]
  const [shuffleMode, setShuffleMode] = useState(false)
  const audioRef = useRef()
  const controllerRef = useRef()
  const rightContainerRef = useRef()
  const leftContainerRef = useRef()
  const currentPlaylistCoverRef = useRef("../src/images/default_album_cover.png")

  useEffect(() => {
    const updateColorTheme = () => {
      if(props.darkTheme){
        controllerRef.current.classList.add("darkThemeMusicController")
        leftContainerRef.current.classList.add("darkThemeLeftContainer")
        rightContainerRef.current.classList.add("darkThemeRightContainer")
        return
      }
      controllerRef.current.classList.remove("darkThemeMusicController")
      leftContainerRef.current.classList.remove("darkThemeLeftContainer")
      rightContainerRef.current.classList.remove("darkThemeRightContainer")
    }
    updateColorTheme()
  }, [props.darkTheme])

  useEffect(() => {
    startNewMusicQueue(props.startedPlaylist)
  }, [props.startedPlaylist])

  const startNewMusicQueue = async(playlistName) => {
    if(playlistName == currentPlaylist) return
    console.log("Starting playlist:", playlistName)
    setCurrentPlaylist(playlistName)
    const details = await localforage.getItem("_playlist_details")
    const orderedQueue = useArrayMerge(
      [details[playlistName]["allArtists"], details[playlistName]["allSongs"]], 
      " - "
    )
    const shuffleQueue = useShuffle(
      useArrayMerge(
        [details[playlistName]["allArtists"], details[playlistName]["allSongs"]], 
        " - "
      )
    )
    const firstSong = !shuffleMode ? orderedQueue[0] : shuffleQueue[0]
    setSongQueueOrdered([...orderedQueue])
    setSongQueueShuffled(useShuffle([...shuffleQueue]))
    setCurrentSong(firstSong)
    currentPlaylistCoverRef.current = details[playlistName]["coverArt"]
    audioRef.current.src = await localforage.getItem(`${playlistName}: ${firstSong}`)
    console.log("Now playing song:", firstSong)
    audioRef.current.play()
  }

  const updateQueues = () => {

  }

  return (
    <footer 
      className="musicController"
      ref={controllerRef}
    >
      <audio ref={audioRef}/>
      <div style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
        <img
            className='currentPlaylistCover'
            title={`${currentPlaylist !== "" ? currentPlaylist : "-"}`}
            src={currentPlaylistCoverRef.current} width={50} height={50}
        />
        <div 
          className="controllerLeftContainer"
          ref={leftContainerRef}
        >
          <Marquee
            className='songMarquee'
            speed={(currentSong !== "" && currentSong.length > 60) ? 25 : 0} 
            gradientColor={"white"} 
            delay={2}
            style={{
              maxWidth: "437.833px"
            }}
          >
            <div className="currentSong">
              {currentSong !== "" ? currentSong : '-'}
            </div>
            {(currentSong !== "" && currentSong.length > 35) ? <div style={{
              opacity: "0"
            }}>
              -------------------------
            </div> : ""}
          </Marquee>
          <div className='mainControls'>
            <div className="controlBtns">
              <button title='Skip back'>
                <SkipBack size={15}  color={props.darkTheme ? 'white' : 'black'}/>
              </button>
              <button title='Play'>
                <Play size={25}  color={props.darkTheme ? 'white' : 'black'}/>
              </button>
              <button title='Skip forward'>
                <SkipForward size={15} color={props.darkTheme ? 'white' : 'black'}/>
              </button>
            </div>
            <div className='songTime'>
              0:00
              <input type="range" className='songLengthBar' min={0} max={100} defaultValue={0}/>
              {audioRef.current !== undefined ? getConvertedTime(audioRef.current.duration, true) : "0:00"}
            </div>
          </div> 
        </div>
      </div>
      <div
        className="controllerRightContainer"
        ref={rightContainerRef}
      >
        <div className="playModeControls">
          <button 
            className='shuffleBtn' 
            title={!shuffleMode ? 'Enable shuffle' : "Disable shuffle"}
            onClick={() => setShuffleMode(!shuffleMode)}
          >
            {shuffleMode ? 
              <Shuffle size={20} color={props.darkTheme ? 'white' : 'black'}/> :
              <Consecutive size={20} color={props.darkTheme ? 'white' : 'black'}/>
            }
          </button>
          <button 
            title={`${currentPlayMode}`}
            onClick={() => {
              setCurrentPlayMode(
                playModes.indexOf(currentPlayMode) == playModes.length - 1 ? "No repeats" 
                  : playModes[playModes.indexOf(currentPlayMode) + 1]
              )
            }}
          >
            {
              currentPlayMode == "No repeats" ? <PlayOnce size={20} color={props.darkTheme ? 'white' : 'black'}/> 
                : currentPlayMode == "Repeat playlist" ? <LoopPlaylist size={20} color={props.darkTheme ? 'white' : 'black'}/> 
                : <LoopSong size={20} color={props.darkTheme ? 'white' : 'black'}/>
            }
          </button>
        </div>
        <div className="volumeControls">
          <VolumeFull size={20}/>
          <input type="range" className='volumeAdjuster' min={0} max={100} defaultValue={100}/>
        </div>
      </div>
    </footer>
  )
}

export default MusicController
