import { useEffect, useRef, useContext } from "react"

import getConvertedTime from "../../../utils/getConvertedTime"
import { uploadAudio, uploadImage } from "../../../utils/useUpload"
import { ViewerContext } from "../../../App"

import { RxUpload as UploadSong } from "react-icons/rx"
import { IoImageOutline as UploadImg, IoTrashOutline as Trash } from "react-icons/io5"
import { BsPlayFill as Play } from "react-icons/bs"

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
    deleteMenuItemFromViewer, 
    startNewPlaylist } = useContext(ViewerContext)

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

  const deletePlaylist = () => {
    if(!confirm(`Playlist "${props.details.name}" will be deleted. Press OK to proceed.`)) return
    removeViewedPlaylist(props.details.name)
    deleteMenuItemFromViewer(props.details.name)
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
            {props.details.length <= 0 ? "0 sec" : getConvertedTime(props.details.length, false)}
          </div>
        </div>
      </div>
      <div className="headerBtns">
        <button
          title="Start playlist"
          onClick={() => {
            if(props.details.songCount <= 0) return
            startNewPlaylist(props.details.name)
          }}
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
          onChange={(e) => {uploadAudio(e.target.files, props.details, updateViewedPlaylist)}}
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
          onChange={(e) => uploadImage(e.target.files[0], props.details, updateViewedPlaylist)}
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
