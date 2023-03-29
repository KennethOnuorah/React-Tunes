import { useRef, useContext } from "react"

import getConvertedTime from "../../../utils/general/getConvertedTime"
import { uploadAudio, uploadImage } from "../../../utils/components/PlaylistViewerHeader/Upload"
import { ViewerContext } from "../../../App"

import { RxUpload as UploadSong } from "react-icons/rx"
import { IoImageOutline as UploadImg, IoTrashOutline as Trash } from "react-icons/io5"
import { BsPlayFill as Play } from "react-icons/bs"

import "./PlaylistViewerHeader.css"

const PlaylistViewerHeader = (props) => {
  const fileUploadBtnRef = useRef()
  const songUploadBtnRef = useRef()
  const {
    setLoading,
    updateViewedPlaylist, 
    removeViewedPlaylist, 
    artistsText, 
    updateDeletedPlaylist, 
    startNewPlaylist 
  } = useContext(ViewerContext)

  const handleButtonClick = (ref) => ref.current.click()

  const deletePlaylist = () => {
    if(!confirm(`Playlist "${props.details.name}" will be deleted. Press OK to proceed.`)) return
    removeViewedPlaylist(props.details.name)
    updateDeletedPlaylist(props.details.name)
  }
  
  return (
    <header className={`playlistViewerHeader${props.darkTheme ? " darkModeHeader" : ""}`}>
      <div className="headerInnerContainer">
        <div className="playlistCoverSection">
          <img
            className={`playlistCover${props.darkTheme ? " darkModePlaylistCover" : ""}`}
            src={props.details.artSrc}
            alt="Playlist cover art"
            height={150}
            width={150}
            draggable={false}
          />
        </div>
        <div className="playlistAboutSection">
          <div className={`playlistTitle${props.darkTheme ? " darkModeText" : ""}`}>
            {props.details.name === "" ? "-" : props.details.name}
          </div>
          <div className={`playlistInfo${props.darkTheme ? " darkModeText" : ""}`}>
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
          onChange={(e) =>  uploadAudio(e.target.files, props.details, updateViewedPlaylist, setLoading)}
        />
        <button 
          htmlFor="uploadSongs"
          title="Upload song(s)"
          onClick={() => handleButtonClick(songUploadBtnRef)}
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
          onClick={() => handleButtonClick(fileUploadBtnRef)}
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
