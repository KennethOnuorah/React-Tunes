import {
  TbVolumeOff as VolumeMute, TbVolume2 as VolumeSome, TbVolume as VolumeFull,
  TbArrowsShuffle as Shuffle, TbArrowsRight as Consecutive,
  TbSquare1 as PlayOnce, TbRepeat as LoopPlaylist, TbRepeatOnce as LoopSong,
} from "react-icons/tb"

import "./RightControls.css"

const RightControls = ({darkTheme, reducer, refs}) => {
  return (
    <div className={`rightControls${darkTheme ? ' darkThemeRightControls' : ''}`}>
      <div className="playModeControls">
        <button 
          className='shuffleBtn' 
          title={!reducer.controls.shuffleEnabled ? 'Enable shuffle' : "Disable shuffle"}
          onClick={() => reducer.setControls({type: "toggle_shuffle_mode"})}
        >
          {
            reducer.controls.shuffleEnabled ? 
              <Shuffle size={20} color={darkTheme ? 'white' : 'black'}/> :
              <Consecutive size={20} color={darkTheme ? 'white' : 'black'}/>
          }
        </button>
        <button 
          title={`${reducer.controls.currentPlayMode}`}
          onClick={() => reducer.setControls({type: "change_play_mode"})}
        >
          {
            reducer.controls.currentPlayMode == "No looping" ? 
              <PlayOnce size={20} color={darkTheme ? 'white' : 'black'}/> : 
              reducer.controls.currentPlayMode == "Loop playlist" ? 
                <LoopPlaylist size={20} color={darkTheme ? 'white' : 'black'}/> : 
                <LoopSong size={20} color={darkTheme ? 'white' : 'black'}/>
          }
        </button>
      </div>
      <div className="volumeControls">
        <button
          onClick={() => {
            reducer.setControls({
              type: "set_volume", volume: refs.audioRef.current.volume > 0 ? 0 : refs.volumeLevelBeforeMute.current
            })
            refs.audioRef.current.volume = refs.audioRef.current.volume > 0 ? 0 : refs.volumeLevelBeforeMute.current
            refs.volumeAdjusterRef.current.value = refs.audioRef.current.volume
          }}
        >
          {
            reducer.controls.volume <= 0 ?
              <VolumeMute size={20} color={darkTheme ? "white" : "black"}/> :
              reducer.controls.volume < 1 ?
              <VolumeSome size={20} color={darkTheme ? "white" : "black"}/> :
              <VolumeFull size={20} color={darkTheme ? "white" : "black"}/>
          }
        </button>            
        <input 
          className='volumeAdjuster' 
          ref={refs.volumeAdjusterRef}
          type="range" 
          min={0} 
          max={1}
          step={0.01}
          defaultValue={1}
          onInput={(e) => {
            refs.audioRef.current.volume = e.target.value
            refs.volumeLevelBeforeMute.current = e.target.value
            reducer.setControls({type: "set_volume", volume: refs.audioRef.current.volume})
          }}
        />
      </div>
    </div>
  )
}

export default RightControls
