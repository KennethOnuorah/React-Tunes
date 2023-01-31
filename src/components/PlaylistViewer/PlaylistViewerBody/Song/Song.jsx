import { useEffect, useState, useRef } from 'react'

import { BsPlayFill as Play, BsPause as Pause} from 'react-icons/bs'
import './Song.css'

const Song = (props) => {
  const [songName, setSongName] = useState("")
  const [artistName, setArtistName] = useState("")
  const [songLength, setSongLength] = useState(0)
  const songRef = useRef()
  const audioRef = useRef()
  const songInfoRef = useRef()
  const playBtnRef = useRef()

  useEffect(() => {
    updateColorTheme()
  }, [props.darkTheme])

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

  //An <audio> element should be in the component as well. There is a callback function called "onMetadataLoaded" that could be of interest to you, rather than looking for a JS library to read metadata. I've bookmarked more on the function in "Coding Help"
  
  return (
    <section 
      className="song"
      ref={songRef}
      onContextMenu={(e) => {
        e.preventDefault()
        console.log("User has left clicked on song:", songName)
      }}
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
            This is a song
          </div>
          <div className='artistName'>
            Artist name
          </div>
        </div>
      </div>
      <div className="songLength">
        0:00
      </div>
    </section>
  )
}

export default Song
