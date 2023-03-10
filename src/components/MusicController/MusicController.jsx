import { useState, useEffect, useRef } from 'react'
import Marquee from 'react-fast-marquee'
import { 
  BsPlayFill as Play, 
  BsPause as Pause, 
  BsFillSkipEndFill as SkipForward, 
  BsFillSkipStartFill as SkipBack,
  BsFillVolumeMuteFill as Mute,
  BsFillVolumeDownFill as VolSoft,
  BsFillVolumeUpFill as VolFull
} from 'react-icons/bs'
import {
  TbArrowsShuffle as Shuffle, 
  TbArrowsRight as Consecutive,
  TbSquare1 as PlayOnce,
  TbRepeat as LoopPlaylist, 
  TbRepeatOnce as LoopSong 
} from 'react-icons/tb'

import "./MusicController.css"

const MusicController = (props) => {
  const [currentPlaylistPlaying, setCurrentPlaylistPlaying] = useState("-")
  const [currentPlayMode, setCurrentPlayMode] = useState("Play once")
  const playModes = ["No repeats", "Repeat playlist", "Repeat song"]
  const [shuffleMode, setShuffleMode] = useState(false)
  const controllerRef = useRef()
  const rightContainerRef = useRef()
  const leftContainerRef = useRef()

  //Updating color theme
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

  return (
    <footer 
      className="musicController"
      ref={controllerRef}
    >
      <audio src=''/>
      <div style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
        <img
            className='currentPlaylistCover'
            title={`${currentPlaylistPlaying}`}
            src="../src/images/default_album_cover.png" width={50} height={50}
        />
        <div 
          className="controllerLeftContainer"
          ref={leftContainerRef}
        >
          <Marquee speed={0} gradientColor={"white"}>
            <div className="currentSong">
              -
            </div>
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
              <input type="range" className='songLengthBar'  min={0} max={100} defaultValue={0}/>
              0:00
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
          <VolFull size={20}/>
          <input type="range" className='volumeAdjuster' min={0} max={100} defaultValue={100}/>
        </div>
      </div>
    </footer>
  )
}

export default MusicController
