import { useState } from 'react'
import { SiApplemusic as AppLogo } from 'react-icons/si'
import { BiSun as Sun, BiMoon as Moon } from 'react-icons/bi'
import { BsGithub as Git } from 'react-icons/bs'
import { SlMagnifier as Search } from 'react-icons/sl'
import { HiChevronRight as Open, HiChevronDown as Close } from 'react-icons/hi'
import { MdOutlineAdd as Add } from 'react-icons/md'
import { RiFolderMusicLine as PLIcon } from 'react-icons/ri'
import './PlaylistMenu.css'

const PlaylistMenu = () => {
  const [darkTheme, setDarkTheme] = useState(false)
  const [playlistsOpen, setPlaylistsOpen] = useState(false)

  return (
    <aside className="playlistMenu">
      <div className="appName">
        <AppLogo color='#00d9ff' className="appLogo"/>
        Tunes
      </div>
      <div className="appOptionSection">
        <button onClick={() => setDarkTheme(!darkTheme)}>
          {
          !darkTheme ? 
            <Moon color='lightgrey' size={20}/> : 
            <Sun color='lightgrey' size={20}/>
          }
          Set {!darkTheme ? "Dark" : "Light"} Theme
        </button>
        <button>
          <Git color='lightgrey' size={20}/>
          Visit Repository
        </button>
      </div>
      <hr/>
      <div className="playlistController">
        <div className="searchPlaylists">
          <Search size={20}/>
          <input type="search" placeholder='Search playlists . . .'/>
        </div>
        <div className="createPlaylistBtn">
          <div className="playlistDropdown">
            <button onClick={() => setPlaylistsOpen(!playlistsOpen)}>
              {
              !playlistsOpen ? 
                <Open size={20} color='lightgrey'/> : 
                <Close size={20} color='lightgrey'/>
              }
            </button>
            Playlists
          </div>
          <button>
            <Add size={20} color='lightgrey'/>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default PlaylistMenu
