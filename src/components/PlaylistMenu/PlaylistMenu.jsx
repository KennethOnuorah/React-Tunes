import { useState, useRef } from 'react'

import { SiApplemusic as AppLogo } from 'react-icons/si'
import { BiSun as Sun, BiMoon as Moon } from 'react-icons/bi'
import { BsGithub as GitHub } from 'react-icons/bs'
import { SlMagnifier as Search } from 'react-icons/sl'
import { HiChevronRight as Open, HiChevronDown as Close } from 'react-icons/hi'
import { MdOutlineAdd as Add } from 'react-icons/md'

import PlaylistMenuItem from './PlaylistMenuItem/PlaylistMenuItem'
import PlaylistMenuItemSettings from './PlaylistMenuItemSettings/PlaylistMenuItemSettings'
import './PlaylistMenu.css'

const PlaylistMenu = (props) => {
  const [dropdownOpened, setDropdownOpened] = useState(false)
  const [totalPlaylists, setTotalPlaylists] = useState([])
  const [menuCoordinates, setMenuCoordinates] = useState({x: 0, y: 0})
  const [enableRenameMode, setEnableRenameMode] = useState(false)
  const [renameRequestID, setRenameRequestID] = useState("")
  const [searchEntry, setSearchEntry] = useState("")
  const draggedPlaylist = useRef("")
  const draggedPlaylistTarget = useRef("")
  const contextMenuRef = useRef()
  const contextTargetRef = useRef("")
  
  const handleSearch = (e) => {
    setSearchEntry(e.target.value)
    setDropdownOpened(e.target.value != '' ? true : dropdownOpened)
  }

  const positionContextMenu = (xPos, yPos, ref) => {
    contextTargetRef.current = ref.current
    clearRenameRequestID()
    setMenuCoordinates({x: xPos, y: yPos})
  }

  const renameDuplicate = (name) => {
    let checkCount = 0
    let baseName = name
    while(totalPlaylists.includes(name))
      name = `${baseName} (${checkCount+=1})`
    return name
  }
  const getRenameRequest = (reqID) => {
    setEnableRenameMode(true)
    setRenameRequestID(reqID)
    console.log("Rename request for:", reqID, "\nRename mode enabled.")
  }
  const clearRenameRequestID = () => setRenameRequestID("")
  const replaceOldPlaylistName = (oldName, newName) => {
    let allNames = totalPlaylists
    allNames[allNames.indexOf(oldName)] = newName
    setTotalPlaylists(allNames)
  }

  const getDeleteRequest = (reqID) => {
    const name = reqID.split('_')[1]
    deletePlaylist(name)
    console.log("Deleted playlist:", name)
  }
  const deletePlaylist = (name) => setTotalPlaylists(totalPlaylists.filter((n) => n != name))

  const setDraggedPlaylist = (name) => draggedPlaylist.current = name
  const setDraggedPlaylistTarget = (name) => draggedPlaylistTarget.current = name
  const rearrangePlaylists = () => {
    console.log("Dragged playlist:", draggedPlaylist.current, "\nTarget playlist:", draggedPlaylistTarget.current)
    const allPlaylists = totalPlaylists
    const startIndex = allPlaylists.indexOf(draggedPlaylist.current)
    const endIndex = allPlaylists.indexOf(draggedPlaylistTarget.current)
    const draggedDown = endIndex > startIndex ? true : false
    if(draggedPlaylist.current !== draggedPlaylistTarget.current && draggedPlaylistTarget.current !== ""){
      for (let i = startIndex; draggedDown ? i < endIndex : i > endIndex; draggedDown ? i++ : i--) {
        const temp = allPlaylists[i]
        const temp2 = allPlaylists[draggedDown ? i+1 : i-1]
        allPlaylists[draggedDown ? i+1 : i-1] = temp
        allPlaylists[i] = temp2
      }
      setTotalPlaylists([...allPlaylists])
      console.log("New arrangement:", totalPlaylists)
    }
    setDraggedPlaylist("")
    setDraggedPlaylistTarget("")
  }
  
  return (
    <aside 
      className="playlistMenu"
      onClick={(e) => {
        (e.target.className != "renamePlaylistBtn" || e.target.className != "deletePlaylistBtn") && 
          contextMenuRef.current.setInvisible()
      }}
    >
      <div className="appName">
        <AppLogo color='#00d9ff' className="appLogo"/>
        Tunes
      </div>
      <div className="appOptionSection">
        <a href="https://github.com/KennethOnuorah/React-Tunes?" target="_blank" rel="noopener noreferrer">
          <GitHub color='lightgrey' size={20}/>
          Visit Repository
        </a>
        <button onClick={() => props.toggleDarkTheme(!props.darkTheme)}>
          {
          !props.darkTheme ? 
            <Moon color='lightgrey' size={20}/> : 
            <Sun color='lightgrey' size={20}/>
          }
          Set {!props.darkTheme ? "Dark" : "Light"} Theme
        </button>
      </div>
      <hr/>
      <div className="playlistController">
        <div className="searchPlaylists">
          <Search size={20}/>
          <input type="search" placeholder='Search playlists . . .' onInput={handleSearch}/>
        </div>
        <div className="createPlaylistBtn">
          <div className="playlistDropdown">
            <button onClick={() => setDropdownOpened(!dropdownOpened)}>
              {!dropdownOpened ? 
                <Open size={20} color='lightgrey'/> : 
                <Close size={20} color='lightgrey'/>}
            </button>
            Playlists
          </div>
          <button 
            title='Create new playlist'
            onClick={() => {
              setDropdownOpened(true)
              setTotalPlaylists([renameDuplicate("New playlist"), ...totalPlaylists])
            }}>
            <Add size={20} color='lightgrey'/>
          </button>
        </div>
      </div>
      <div className="playlistContainer">
        {totalPlaylists.map((name) => (dropdownOpened && name.toLowerCase().includes(searchEntry.toLowerCase())) && 
          <PlaylistMenuItem
            key={`${name}_${Math.ceil(Math.pow(10, 10) * Math.random() * Math.random())}`} 
            name={name}
            handleContextMenu={positionContextMenu}
            setDraggedPlaylist={setDraggedPlaylist}
            setDraggedPlaylistTarget={setDraggedPlaylistTarget}
            rearrangePlaylists={rearrangePlaylists}
            enableRenameMode={renameRequestID === "pl_"+name ? enableRenameMode : false}
            replaceOldPlaylistName={replaceOldPlaylistName}
            clearRenameRequestID={clearRenameRequestID}
            renameDuplicate={renameDuplicate}
          />)}
        <PlaylistMenuItemSettings
          ref={contextMenuRef}
          xPos={menuCoordinates.x}
          yPos={menuCoordinates.y} 
          targetElementID={contextTargetRef.current !== '' ? contextTargetRef.current.id : ""}
          getRenameRequest={getRenameRequest}
          getDeleteRequest={getDeleteRequest}
        />
      </div>
    </aside>
  )
}

export default PlaylistMenu
