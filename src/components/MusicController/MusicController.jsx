import { useState, useEffect, useRef } from 'react'
import Marquee from 'react-fast-marquee'
import { 
  BsPlayFill as Play, 
  BsPause as Pause, 
  BsFillSkipEndFill as SkipForward, 
  BsFillSkipStartFill as SkipBack,
  BsFillVolumeMuteFill as Mute,
  BsFillVolumeDownFill as VolSoft,
  BsFillVolumeUpFill as VolFull} from 'react-icons/bs'
import { 
  MdOutlineRepeat as Loop, 
  MdOutlineRepeatOne as LoopSong,
  MdOutlineShuffle as Shuffle } from 'react-icons/md'

import "./MusicController.css"

const MusicController = (props) => {
  const [currentPlaylistPlaying, setCurrentPlaylistPlaying] = useState("")
  const [playMode, setPlayMode] = useState("")
  const [shuffleMode, setShuffleMode] = useState(false)
  const controllerRef = useRef()
  const rightContainerRef = useRef()
  const leftContainerRef = useRef()

  useEffect(() => {
    props.darkTheme ? controllerRef.current.classList.add("darkThemeMusicController") : controllerRef.current.classList.remove("darkThemeMusicController")
    props.darkTheme ? leftContainerRef.current.classList.add("darkThemeLeftContainer") : leftContainerRef.current.classList.remove("darkThemeLeftContainer")
    props.darkTheme ? rightContainerRef.current.classList.add("darkThemeRightContainer") : rightContainerRef.current.classList.remove("darkThemeRightContainer")
  }, [props.darkTheme])

  return (
    <footer 
      className="musicController"
      ref={controllerRef}>
      <div 
        className="controllerLeftContainer"
        ref={leftContainerRef}>
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
      <div 
        className="controllerRightContainer"
        ref={rightContainerRef}>
        <div className="playModeControls">
          <button className='shuffleBtn' title='Enable shuffle'>
            <Shuffle size={20} color={props.darkTheme ? 'white' : 'black'}/>
          </button>
          <button title='Loop playlist'>
            <Loop size={20} color={props.darkTheme ? 'white' : 'black'}/>
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
