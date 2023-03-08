import { useEffect, useState, useRef } from "react"
import * as localforage from "localforage"

import Song from "./Song/Song"
import "./PlaylistViewerBody.css"

const PlaylistViewerBody = (props) => {
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [durations, setDurations] = useState([])
  const [rearrangementCount, setRearrangementCount] = useState(0)
  
  const draggedSong = useRef("")
  const draggedSongTarget = useRef("")

  useEffect(() => {
    const update = async() => {
      const details = await localforage.getItem("_playlist_details")
      setSongs(details[props.details.name]["allSongs"])
      setArtists(details[props.details.name]["allArtists"])
      setDurations(details[props.details.name]["allSongDurations"])
    }
    update()
  }, [props.details.songCount, rearrangementCount])

  const setDraggedSong = (name) => draggedSong.current = name
  const setDraggedSongTarget = (name) => draggedSongTarget.current = name
  const rearrangeSongs = async() => {
    let details = await localforage.getItem("_playlist_details")
    let songList = details[props.details.name]["allSongs"]
    let artistList = details[props.details.name]["allArtists"]
    let durationList = details[props.details.name]["allSongDurations"]
    const start = songList.indexOf(draggedSong.current)
    const end = songList.indexOf(draggedSongTarget.current)
    const draggedDown = end > start ? true : false
    if(draggedSong.current !== draggedSongTarget.current || draggedSongTarget.current !== ""){
      for (let i = start; draggedDown ? i < end : i > end; draggedDown ? i++ : i--) {
        const sTemp = songList[i]
        const aTemp = artistList[i]
        const dTemp = durationList[i]
        const sTemp2 = songList[draggedDown ? i+1 : i-1]
        const aTemp2 = artistList[draggedDown ? i+1 : i-1]
        const dTemp2 = durationList[draggedDown ? i+1 : i-1]
        songList[draggedDown ? i+1 : i-1] = sTemp
        artistList[draggedDown ? i+1 : i-1] = aTemp
        durationList[draggedDown ? i+1 : i-1] = dTemp
        songList[i] = sTemp2
        artistList[i] = aTemp2
        durationList[i] = dTemp2
      }
      details[props.details.name]["allSongs"] = songList
      details[props.details.name]["allArtists"] = artistList
      details[props.details.name]["allSongDurations"] = durationList
      await localforage.setItem("_playlist_details", details)
      setRearrangementCount(rearrangementCount + 1)
    }
    else{
      setDraggedSong("")
      setDraggedSongTarget("")
    }
    setDraggedSong("")
    setDraggedSongTarget("")
  }

  return (
    <section className="playlistViewerBody">
      {
        songs.map((song) =>
          <Song
            key={`${song}_${Math.ceil(Math.pow(10, 10) * Math.random() * Math.random())}`}
            darkTheme={props.darkTheme}
            playlist={props.details.name}
            songName={song} 
            songArtist={artists[songs.indexOf(song)]}
            songDuration={durations[songs.indexOf(song)]}
            setDraggedSong={setDraggedSong}
            setDraggedSongTarget={setDraggedSongTarget}
            rearrangeSongs={rearrangeSongs}
          />
        )
      }
    {/* FORGET THE CONTEXT MENU. JUST PUT A TRASH BUTTON NEXT TO THE SONG DURATION (MUCH EASIER) */}
    </section>
  )
}

export default PlaylistViewerBody
