import { useEffect, useRef, useContext } from "react"
import * as localforage from "localforage"
import * as id3 from "id3js"
import { ViewerContext } from "../../../App"

import { RxUpload as UploadSong } from "react-icons/rx"
import { IoImageOutline as UploadImg, IoTrashOutline as Trash } from "react-icons/io5"
import { BsPlayFill as Play, BsPause as Pause } from "react-icons/bs"

import "./PlaylistViewerHeader.css"

const PlaylistViewerHeader = (props) => {
  const headerRef = useRef()
  const playlistTitleRef = useRef()
  const playlistInfoRef = useRef()
  const playlistCoverRef = useRef()
  const fileUploadBtnRef = useRef()
  const songUploadBtnRef = useRef()
  const { 
    updateViewedPlaylist, 
    removeViewedPlaylist, 
    artistsText, 
    deleteMenuItemFromViewer } = useContext(ViewerContext)

  useEffect(() => {
    const updateColorTheme = () => {
      if (props.darkTheme) {
        headerRef.current.classList.add("darkModeHeader")
        playlistTitleRef.current.classList.add("darkModeText")
        playlistInfoRef.current.classList.add("darkModeText")
        playlistCoverRef.current.classList.add("darkModePlaylistCover")
        return
      }
      headerRef.current.classList.remove("darkModeHeader")
      playlistTitleRef.current.classList.remove("darkModeText")
      playlistInfoRef.current.classList.remove("darkModeText")
      playlistCoverRef.current.classList.remove("darkModePlaylistCover")
    }
    updateColorTheme()
  }, [props.darkTheme])

  const handleBtnClick = (ref) => ref.current.click()
  
  const uploadSongs = async(fileList) => {
    const playlistDetails = await localforage.getItem("_playlist_details")
    for(const file of fileList) {
      const tags = await id3.fromFile(file)
      let reader = new FileReader()
      reader.onloadend = async() => {
        let audio = new Audio(reader.result)
        audio.onloadedmetadata = async() => {
          playlistDetails[props.details.name]["totalLength"] += Math.floor(audio.duration)
          playlistDetails[props.details.name]["allSongDurations"].push(Math.floor(audio.duration))
          await localforage.setItem(`_playlist_details`, playlistDetails)
        }
        await localforage.setItem(`${props.details.name}: ${tags.artist} - ${tags.title}`, reader.result)
        updateViewedPlaylist({
          artists: playlistDetails[props.details.name]["allArtists"],
          songCount: [...playlistDetails[props.details.name]["allSongs"]].length,
          length: playlistDetails[props.details.name]["totalLength"]
        }, props.details.name)
      }
      reader.readAsDataURL(file)
      console.log(`Uploading song: ${tags.artist} - ${tags.title}`)
      playlistDetails[props.details.name]["allArtists"].push(tags.artist)
      playlistDetails[props.details.name]["allSongs"].push(tags.title)
    }
    await localforage.setItem(`_playlist_details`, playlistDetails)
    console.log(`Updated playlist details (${new Date().toLocaleTimeString()})\n`, playlistDetails)
  }

  const uploadCoverArt = (img) => {
    var reader = new FileReader()
    reader.onloadend = async() => {
      const playlistDetails = await localforage.getItem("_playlist_details")
      playlistDetails[props.details.name]["coverArt"] = reader.result
      await localforage.setItem("_playlist_details", playlistDetails)
      updateViewedPlaylist({ artSrc: reader.result }, props.details.name)
    }
    reader.readAsDataURL(img)
  }

  const deletePlaylist = () => {
    if(!confirm(`Playlist "${props.details.name}" will be deleted. Press OK to proceed.`)) return
    removeViewedPlaylist(props.details.name)
    deleteMenuItemFromViewer(props.details.name)
  }

  const setTimeLength = (seconds) => {
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
    let time = `${hr > 0 ? hr + " hr," : ""} ${min > 0 ? min + " min," : ""} ${sec} sec`
    return time
  }

  return (
    <header className="playlistViewerHeader" ref={headerRef}>
      <div className="headerInnerContainer">
        <div className="playlistCoverSection">
          <img
            className="playlistCover"
            ref={playlistCoverRef}
            src={props.details.artSrc}
            alt="Playlist cover art"
            height={150}
            width={150}
            draggable={false}
          />
        </div>
        <div className="playlistAboutSection">
          <div className="playlistTitle" ref={playlistTitleRef}>
            {props.details.name === "" ? "-" : props.details.name}
          </div>
          <div className="playlistInfo" ref={playlistInfoRef}>
            {artistsText}
            <br/>
            {props.details.songCount} Song{props.details.songCount === 1 ? "" : 's'}
            <br/>
            {props.details.length <= 0 ? "0 sec" : setTimeLength(props.details.length)}
          </div>
        </div>
      </div>
      <div className="headerBtns">
        <button
          title="Begin playlist"
          style={{
            backgroundColor: props.darkTheme ? "#0ecfe6" : "#00e4ff"
          }} 
        >
          <Play size={30} />
        </button>
        <input
          hidden
          multiple
          type="file"
          accept=".mp3, .wav, .ogg, .flac"
          id="uploadSongs"
          ref={songUploadBtnRef}
          onChange={(e) => {uploadSongs(e.target.files)}}
        />
        <button 
          htmlFor="uploadSongs"
          title="Upload song(s)"
          onClick={() => handleBtnClick(songUploadBtnRef)}
          style={{
            backgroundColor: props.darkTheme ? "white" : "#2b2b2b"
          }}
        >
          <UploadSong 
            size={25}
            style={{
              color: props.darkTheme ? "#2b2b2b" : "white"
            }}
          />
        </button>
        <input 
          hidden 
          type="file"
          accept=".png, .jpeg, .webp"
          id="uploadImage" 
          ref={fileUploadBtnRef} 
          onChange={(e) => uploadCoverArt(e.target.files[0])}
        />
        <button 
          htmlFor="uploadImage" 
          title="Upload cover art"
          onClick={() => handleBtnClick(fileUploadBtnRef)}
          style={{
            backgroundColor: props.darkTheme ? "white" : "#2b2b2b"
          }}
        >
          <UploadImg 
            size={25}
            style={{
              color: props.darkTheme ? "#2b2b2b" : "white"
            }}
          />
        </button>
        <button 
          title="Delete playlist"
          onClick={() => deletePlaylist()}
          style={{
            backgroundColor: props.darkTheme ? "white" : "#2b2b2b"
          }}
        >
          <Trash 
            size={25}
            style={{
              color: props.darkTheme ? "#2b2b2b" : "white"
            }}
          />
        </button>
      </div>
    </header>
  )
}

export default PlaylistViewerHeader
