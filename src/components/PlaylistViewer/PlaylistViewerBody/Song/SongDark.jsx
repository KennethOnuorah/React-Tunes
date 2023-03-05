import { useEffect, useState, useRef } from 'react'
// import * as localforage from 'localforage'

import { BsPlayFill as Play, BsPause as Pause} from 'react-icons/bs'
import './SongDark.css'

const SongDark = (props) => {
  const [songName, setSongName] = useState("")
  const [draggedOver, setDraggedOver] = useState(false)
  const songRef = useRef()
  const songInfoRef = useRef()
  const playBtnRef = useRef()

  //Setting the song name
  useEffect(() => {
    setSongName(`${props.songArtist} - ${props.songName}`)
  }, [])

  const toDigitalFormat = (seconds) => {
    let sec = 0
    let min = 0
    let hr = 0
    while(seconds > 0){
      if(0 < seconds && seconds < 59){
        sec = seconds
        seconds = 0
      }else if(60 < seconds && seconds < 3599){
        min = Math.floor(seconds / 60)
        seconds %= 60
      }else if(seconds > 3600){
        hr = Math.floor(seconds / 3600)
        seconds %= 3600
      }
    }
    const secText = sec.toString().padStart(2, '0')
    const minText = hr > 0 ? min.toString().padStart(2, '0') : min.toString()
    const hrText = hr > 0 ? hr.toString().padStart(2, '0') + ":" : ""
    let time = `${hrText}${minText}:${secText}`
    return time
  }
  
  return (
    <section 
      className="songDark"
      ref={songRef}
      onDragStart={() => props.setDraggedSong(props.songName)}
      onDragEnd={() => props.rearrangeSongs()}
      onDragOver={(e) => {
        e.preventDefault()
        setDraggedOver(true)
        props.setDraggedSongTarget(props.songName)
      }}
      onDragExit={() => {
        setDraggedOver(false)
        props.setDraggedSongTarget("")
      }}
      style={{
        border: draggedOver ? "2px solid white" : "0px solid transparent"
      }}
      draggable>
      <div className="songLeftSectionDark">
        <button 
          className='playBtnDark'
          ref={playBtnRef}
        >
          <Play size={25}/>
        </button>
        <div 
          className="songInfo"
          ref={songInfoRef}>
          <div className='songName'>
            {props.songName}
          </div>
          <div className='artistName'>
            {props.songArtist}
          </div>
        </div>
      </div>
      <div className="songLength">
        {toDigitalFormat(props.songDuration)}
      </div>
    </section>
  )
}

export default SongDark

