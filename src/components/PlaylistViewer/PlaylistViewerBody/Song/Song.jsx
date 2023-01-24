import { useEffect, useState, useRef } from 'react'

import { BsPlayFill as Play, BsPause as Pause} from 'react-icons/bs'
import './Song.css'

const Song = (props) => {
  const [songName, setSongName] = useState("")
  const [artistName, setArtistName] = useState("")
  const [songLength, setSongLength] = useState(0)
  const [playing, isPlaying] = useState(false)
  const songRef = useRef()
  const songInfoRef = useRef()
  const playBtnRef = useRef()

  useEffect(() => {
    props.darkTheme ? songRef.current.classList.add("darkThemeSong") : songRef.current.classList.remove("darkThemeSong")
    props.darkTheme ? songInfoRef.current.classList.add("darkThemeLeftSection") : songInfoRef.current.classList.remove("darkThemeLeftSection")
    props.darkTheme ? playBtnRef.current.classList.add("darkThemePlayBtn") : playBtnRef.current.classList.remove("darkThemePlayBtn")
  }, [props.darkTheme])
  
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
