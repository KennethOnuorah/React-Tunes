import { useEffect, useState, useRef } from 'react'

import { BsPlayFill as Play, BsPause as Pause} from 'react-icons/bs'
import './Song.css'

const Song = (props) => {
  const [songName, setSongName] = useState("")
  const songRef = useRef()
  const songInfoRef = useRef()
  const playBtnRef = useRef()

  //Updating the color theme
  useEffect(() => {
    const updateColorTheme = () => {
      if(props.darkTheme){
        songRef.current.classList.add("darkThemeSong")
        songInfoRef.current.classList.add("darkThemeLeftSection")
        playBtnRef.current.classList.add("darkThemePlayBtn")
        return
      }
      songRef.current.classList.remove("darkThemeSong")
      songInfoRef.current.classList.remove("darkThemeLeftSection")
      playBtnRef.current.classList.remove("darkThemePlayBtn")
    }
    updateColorTheme()
  }, [props.darkTheme])

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
      className="song"
      ref={songRef}
      onDragStart={() => {}}
      onDragEnd={() => {}}
      onDragOver={() => {}}
      onDragExit={() => {}}
      draggable>
      <div className="songLeftSection">
        <button 
          className='playBtn'
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

export default Song
