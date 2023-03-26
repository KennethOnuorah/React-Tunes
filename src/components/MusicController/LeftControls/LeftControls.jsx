import Marquee from 'react-fast-marquee'
import getConvertedTime from '../../../utils/general/getConvertedTime'

import {
  BsPlayFill as Play, BsPauseFill as Pause, 
  BsFillSkipEndFill as SkipForward, BsFillSkipStartFill as SkipBack,
} from "react-icons/bs"

import "./LeftControls.css"

const LeftControls = ({darkTheme, reducer, functions, refs}) => {
  return (
    <div className={`leftControls${darkTheme ? ' darkThemeLeftControls' : ''}`}>
      <Marquee
        className='songMarquee'
        speed={(reducer.song.currentSong !== "" && reducer.song.currentSong.length > 60) ? 25 : 0} 
        gradientColor={"white"} 
        delay={2}
        style={{
          maxWidth: "437.833px"
        }}
      >
        <div className="currentSong">
          {reducer.song.currentSong !== "" ? reducer.song.currentSong : '-'}
        </div>
        {
          (reducer.song.currentSong !== "" && reducer.song.currentSong.length > 35) ? 
            <div style={{opacity: "0"}}>-------------------------</div> : 
            ""
        }
      </Marquee>
      <div className='mainControls'>
        <div className="controlBtns">
          <button 
            title='Skip back'
            onClick={() => functions.skipCurrentSong("left")}
          >
            <SkipBack size={15}  color={darkTheme ? 'white' : 'black'}/>
          </button>
          <button 
            title={refs.audioRef.current && !refs.audioRef.current.paused ? "Pause" : "Play"}
            onClick={() => {
              if(!refs.audioRef.current) return
              if(!refs.audioRef.current.paused) {
                refs.audioRef.current.pause()
                reducer.controlsDispatch({type: "set_paused", isPaused: true})
              }else{
                refs.audioRef.current.play()
                reducer.controlsDispatch({type: "set_paused", isPaused: false})
              }
            }}
          >
            {
              reducer.controls.paused ?
                <Play size={25} color={darkTheme ? 'white' : 'black'}/> : 
                <Pause size={25} color={darkTheme ? 'white' : 'black'}/>
            }
          </button>
          <button 
            title='Skip forward'
            onClick={() => functions.skipCurrentSong("right")}
          >
            <SkipForward size={15} color={darkTheme ? 'white' : 'black'}/>
          </button>
        </div>
        <div className='songTime'>
          <div style={{ width: "30px", textAlign: "right" }}>
            {reducer.song.currentTime}
          </div>
          <input 
            className='playbackBar' 
            ref={refs.playbackBarRef}
            type="range" 
            defaultValue={0}
            min={0} 
            max={Math.floor(refs.audioRef.current ? refs.audioRef.current.duration : 0)} 
            onMouseDown={() => reducer.controlsDispatch({type: "drag_playback", isPlaybackDragged: true})}
            onMouseUp={(e) => {
              reducer.controlsDispatch({type: "drag_playback", isPlaybackDragged: false})
              refs.audioRef.current.currentTime = e.target.value
            }}
            onInput={(e) => reducer.controls.playbackDragged && songDispatch({
              type: "update_current_time", time: getConvertedTime(e.target.value, true)
            })}
          />
          {reducer.song.duration}
        </div>
      </div> 
    </div>
  )
}

export default LeftControls
