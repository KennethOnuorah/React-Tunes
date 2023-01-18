
import { HiOutlineUpload as UploadSong } from "react-icons/hi"
import { IoImageOutline as UploadImg } from "react-icons/io5"
import { BsPlayFill as Play, BsPause as Pause} from 'react-icons/bs'
import { HiOutlineClock as Time, HiOutlineHashtag as SongNumber} from "react-icons/hi"

import "./PlaylistViewerHeader.css"

const PlaylistViewerHeader = (props) => {
  return (
    <header className='playlistViewerHeader'>
      <div className="headerInnerContainerTop">
        <div className="headerInnerContainerTopLeft">
          <img
            className="playlistCover"
            src="../src/images/default_album_cover.png" 
            height={150} width={150}
            draggable={false}
          />
        </div>
        <div className="headerInnerContainerTopRight">
          <div className="playlistTitle" title="New playlist">
            -
          </div>
          <div className="playlistInfo">
            No artists
            <br/>
            0 Songs
            <br/>
            0 min 0 sec
          </div>
          <div className="playlistBtns">
            <button style={{backgroundColor: "#0ecfe6"}}>
              <Play size={30}/>
            </button>
            <button>
              <UploadSong size={25}/>
            </button>
            <button>
              <UploadImg size={25}/>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PlaylistViewerHeader

