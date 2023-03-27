import { useEffect, useState, useRef, useContext } from "react"
import { ViewerContext } from "../../../App"
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
  const { updateViewedPlaylist, selectSong} = useContext(ViewerContext)

  useEffect(() => {
    const update = async() => {
      const details = await localforage.getItem("_playlist_details")
      setSongs(details[props.details.name]["allSongs"])
      setArtists(details[props.details.name]["allArtists"])
      setDurations(details[props.details.name]["allSongDurations"])
    }
    update()
  }, [props.details.name, props.details.songCount, rearrangementCount])

  const setDraggedSong = (name) => draggedSong.current = name
  const setDraggedSongTarget = (name) => draggedSongTarget.current = name

  //Temporary function; Too ugly and bloated. Will need rewrite in the future
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
      updateViewedPlaylist({
        artists: artistList
      }, props.details.name)
    }
    else{
      setDraggedSong("")
      setDraggedSongTarget("")
    }
    setDraggedSong("")
    setDraggedSongTarget("")
  }

  const deleteSong = async(playlistName, songInfo={name: "", artist: "", duration: 0}, songBase64Key) => {
    await localforage.removeItem(songBase64Key)
    let details = await localforage.getItem("_playlist_details")
    const names = details[playlistName]["allSongs"]
    const artists = details[playlistName]["allArtists"]
    const durations = details[playlistName]["allSongDurations"]
    const removedIndex = names.indexOf(songInfo.name)
    details[playlistName]["allSongs"] = names.filter((n) => names.indexOf(n) !== removedIndex)
    details[playlistName]["allArtists"] = artists.filter((a) => artists.indexOf(a) !== removedIndex)
    details[playlistName]["allSongDurations"] = durations.filter((d) => durations.indexOf(d) !== removedIndex)
    let newLength = 0
    details[playlistName]["allSongDurations"].forEach((d) => newLength += d)
    await localforage.setItem("_playlist_details", details)
    updateViewedPlaylist({
      artists: details[playlistName]["allArtists"],
      songCount: [...details[playlistName]["allSongs"]].length,
      length: newLength
    }, playlistName)
  }

  return (
    <section className="playlistViewerBody">
      {songs.map((song) =>
        <Song
          key={`${song}_${Math.ceil(Math.pow(10, 10) * Math.random() * Math.random())}`}
          darkTheme={props.darkTheme}
          playlistName={props.details.name}
          songName={song} 
          songArtist={artists[songs.indexOf(song)]}
          songDuration={durations[songs.indexOf(song)]}
          setDraggedSong={setDraggedSong}
          setDraggedSongTarget={setDraggedSongTarget}
          rearrangeSongs={rearrangeSongs}
          deleteSong={deleteSong}
          selectSong={selectSong}
        />)}
    </section>
  )
}

export default PlaylistViewerBody
