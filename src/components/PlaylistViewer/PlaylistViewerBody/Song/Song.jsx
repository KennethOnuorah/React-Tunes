import {useRef, useState} from "react"

import * as localforage from "localforage"
import getConvertedTime from "../../../../utils/general/getConvertedTime"

import {BsPlayFill as Play, BsPause as Pause} from "react-icons/bs"
import { IoTrashOutline as Delete } from "react-icons/io5"
import "./Song.css"

const Song = (props) => {
  const songName = useRef(`${props.songArtist} - ${props.songName}`)
  const [draggedOver, setDraggedOver] = useState(false)

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
        {getConvertedTime(props.songDuration, true)}
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
