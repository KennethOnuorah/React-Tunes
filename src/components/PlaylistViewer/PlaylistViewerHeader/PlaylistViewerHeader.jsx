import { useEffect, useRef, useState } from "react"

import { HiOutlineUpload as UploadSong } from "react-icons/hi"
import { IoImageOutline as UploadImg, IoTrashOutline as Trash } from "react-icons/io5"
import { BsPlayFill as Play, BsPause as Pause} from 'react-icons/bs'

import "./PlaylistViewerHeader.css"

const PlaylistViewerHeader = (props) => {
  const [playlistTitle, setPlaylistTitle] = useState("")
  const [playlistArtists, setPlaylistArtists] = useState([])
  const [songCount, setSongCount] = useState(0)
  const [playlistLength, setPlaylistLength] = useState(0)
  const headerRef = useRef()
  const playlistTitleRef = useRef()
  const playlistInfoRef = useRef()

  useEffect(() => {
    props.darkTheme ? headerRef.current.classList.add("darkModeHeader") : headerRef.current.classList.remove("darkModeHeader")
    props.darkTheme ? playlistTitleRef.current.classList.add("darkModeText") : playlistTitleRef.current.classList.remove("darkModeText")
    props.darkTheme ? playlistInfoRef.current.classList.add("darkModeText") : playlistInfoRef.current.classList.remove("darkModeText")
  }, [props.darkTheme])

  return (
    <header
      className='playlistViewerHeader'
      ref={headerRef}>
      <div className="headerInnerContainer">
        <div className="playlistCoverSection">
          <img
            className="playlistCover"
            src="../src/images/default_album_cover.png" 
            height={150} width={150}
            draggable={false}
          />
        </div>
        <div className="playlistAboutSection">
          <div 
            className="playlistTitle"
            ref={playlistTitleRef}>
            New playlist
          </div>
          <div 
            className="playlistInfo"
            ref={playlistInfoRef}>
            No artists
            <br/>
            0 Songs
            <br/>
            0 min 0 sec
          </div>
        </div>
      </div>
      <div className="playlistBtns">
        <button style={{backgroundColor: "#0ecfe6"}} title="Start playlist">
          <Play size={30}/>
        </button>
        <button title="Upload song(s)">
          <UploadSong size={25}/>
        </button>
        <button title="Upload cover art">
          <UploadImg size={25}/>
        </button>
        <button title="Delete playlist">
          <Trash size={25}/>
        </button>
      </div>
    </header>
  )
}

export default PlaylistViewerHeader
