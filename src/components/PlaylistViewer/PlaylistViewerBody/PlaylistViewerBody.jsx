import { useContext, useEffect, useState } from "react"
import { ViewerContext } from "../../../App"
import * as localforage from "localforage"

import Song from "./Song/Song"
import "./PlaylistViewerBody.css"

const PlaylistViewerBody = (props) => {
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [durations, setDurations] = useState([])
  const { details } = useContext(ViewerContext)

  useEffect(() => {
    const getSongs = async() => {
      console.log("Adding song to viewer display...")
      const details = await localforage.getItem("_playlist_details")
      setSongs(details[props.details.name]["allSongs"])
      setArtists(details[props.details.name]["allArtists"])
      setDurations(details[props.details.name]["allSongDurations"])
    }
    getSongs()
  }, [props.details.songCount])

  const setDraggedSong = () => {

  }
  
  const setDraggedSongTarget = () => {
    
  }

  return (
    <section className="playlistViewerBody">
      {
        songs.map((song) => 
          <Song
            key={song}
            darkTheme={props.darkTheme} 
            songName={song} 
            songArtist={artists[songs.indexOf(song)]}
            songDuration={durations[songs.indexOf(song)]}/>)
      }
    </section>
  )
}

export default PlaylistViewerBody
