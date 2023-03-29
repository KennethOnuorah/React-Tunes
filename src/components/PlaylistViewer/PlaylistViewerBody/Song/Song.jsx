import { useContext, useState } from "react"
import { ViewerContext } from "../../../../App"

import getConvertedTime from "../../../../utils/general/getConvertedTime"

import {BsPlayFill as Play} from "react-icons/bs"
import { IoTrashOutline as Delete } from "react-icons/io5"
import "./Song.css"

const Song = (props) => {
  const base64Key = `${props.playlistName}: ${props.songArtist} - ${props.songName}`
  const [draggedOver, setDraggedOver] = useState(false)
  const { updateDeletedSong, currentSong } = useContext(ViewerContext)

  return (
    <section
      className="song"
      onDragStart={() => props.setDraggedSong(props.songName)}
      onDragEnd={() => {
        props.rearrangeSongs()
      }}
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
        animation: currentSong === base64Key ? "glowing_neon_outline 1.5s infinite" : ""
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
          onClick={() => props.selectSong(base64Key)}
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
        {getConvertedTime(props.songDuration, true)}
        <button
          className="removeSongBtn"
          onClick={async() => {
            if(!confirm(`"${props.songArtist} - ${props.songName}" will be deleted from "${props.playlistName}." Press OK to confirm.`)) return
            updateDeletedSong(base64Key.split(": ")[1])
            props.deleteSong(
              props.playlistName, 
              {name: props.songName, artist: props.songArtist, duration: props.songDuration},
              base64Key
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
