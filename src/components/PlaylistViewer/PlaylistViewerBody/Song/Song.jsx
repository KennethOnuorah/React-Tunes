import * as localforage from "localforage"
import {useRef, useState} from "react"

import {BsPlayFill as Play, BsPause as Pause} from "react-icons/bs"
import { IoTrashOutline as Delete } from "react-icons/io5"
import "./Song.css"

const Song = (props) => {
  const songName = useRef(`${props.songArtist} - ${props.songName}`)
  const [draggedOver, setDraggedOver] = useState(false)

  const toDigitalFormat = (seconds) => {
    let sec = 0
    let min = 0
    let hr = 0
    while (seconds > 0) {
      if (0 < seconds && seconds < 59) {
        sec = seconds
        seconds = 0
      } else if (60 < seconds && seconds < 3599) {
        min = Math.floor(seconds / 60)
        seconds %= 60
      } else if (seconds > 3600) {
        hr = Math.floor(seconds / 3600)
        seconds %= 3600
      }
    }
    const secText = sec.toString().padStart(2, "0")
    const minText = hr > 0 ? min.toString().padStart(2, "0") : min.toString()
    const hrText = hr > 0 ? hr.toString().padStart(2, "0") + ":" : ""
    let time = `${hrText}${minText}:${secText}`
    return time
  }

  return (
    <section
      className="song"
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
        border: draggedOver ? props.darkTheme ? "2px solid white" : "2px solid black" : "0px solid transparent",
        backgroundColor: props.darkTheme ? "rgb(33, 33, 33)" : "rgb(243, 243, 243)",
      }}
      draggable
    >
      <div
        className="songLeftSection"
        style={{
          color: props.darkTheme ? "white" : "black",
        }}
      >
        <button 
          className="playBtn" 
          style={{
            color: props.darkTheme ? "white" : "black"
          }}
        >
          <Play size={25} />
        </button>
        <div className="songInfo">
          <div className="songName">{props.songName}</div>
          <div className="artistName">{props.songArtist}</div>
        </div>
      </div>
      <div 
        className="songLength"
        style={{
          color: props.darkTheme ? "white" : "black"
        }}
      >
        {toDigitalFormat(props.songDuration)}
        <button
          className="removeSongBtn"
          onClick={async() => {
            if(!confirm(`"${songName.current}" will be deleted from playlist "${props.playlistName}." Press OK to confirm deletion.`)) return
            props.deleteSong(
              props.playlistName, 
              {name: props.songName, artist: props.songArtist, duration: props.songDuration},
              `${props.playlistName}: ${songName.current}`
            )
          }}
          style={{
            color: props.darkTheme ? "white" : "black"
          }}
        >
          <Delete size={25}/>
        </button>
      </div>
    </section>
  )
}

export default Song
