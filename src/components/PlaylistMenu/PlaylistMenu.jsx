import { useState, useRef, useEffect, createContext, useContext } from 'react'
import { useUpdateEffect } from 'react-use'
import { MenuContext } from '../../App'
import { rearrangeMenuItems } from '../../utils/Rearrange'

import * as localforage from "localforage"

import { SiApplemusic as AppLogo } from 'react-icons/si'
import { BiSun as Sun, BiMoon as Moon } from 'react-icons/bi'
import { BsGithub as GitHub } from 'react-icons/bs'
import { SlMagnifier as Search } from 'react-icons/sl'
import { HiChevronRight as Open, HiChevronDown as Close } from 'react-icons/hi'
import { MdOutlineAdd as Add } from 'react-icons/md'

import MenuItem from './MenuItem/MenuItem'
import MenuItemContextMenu from './MenuItemContextMenu/MenuItemContextMenu'
import './PlaylistMenu.css'

export const MenuItemContext = createContext()
const PlaylistMenu = (props) => {
  const [dropdownOpened, setDropdownOpened] = useState(true)
  const [playlistList, setPlaylistList] = useState([])
  const [menuCoordinates, setMenuCoordinates] = useState({x: 0, y: 0})
  const [enableRenameMode, setEnableRenameMode] = useState(false)
  const [renameRequestID, setRenameRequestID] = useState("")
  const [searchEntry, setSearchEntry] = useState("")

  const { removeViewedPlaylist, requestedDeletionFromViewer } = useContext(MenuContext)

  const draggedPlaylist = useRef("") 
  const draggedPlaylistTarget = useRef("")
  const contextMenuRef = useRef()
  const contextTargetRef = useRef("")

  //Getting playlists on initialization
  useEffect(() => {
    const getPlaylists = async() => {
      try {
        const list = await localforage.getItem("_playlist_all")
        setPlaylistList(list === null ? [] : [...list])
      } 
      catch(err) {
        console.error(err)
      }
    }
    getPlaylists()
  }, [])

  //Saving and updating the list of playlists.
  useUpdateEffect(() => {
    const savePlaylistList = async() => {
      try {
        await localforage.setItem("_playlist_all", [...playlistList])
        console.log(`Playlist list saved (${new Date().toLocaleTimeString()})\n`, playlistList)
      } 
      catch (err) {
        console.error(err)
      }
    }
    savePlaylistList()
  }, [playlistList.join("")])

  //Deleting a specific playlist from the viewer
  useUpdateEffect(() => {
    deletePlaylist(requestedDeletionFromViewer)
  }, [requestedDeletionFromViewer])

  //Create store containing default information for newly created playlist
  const createNewPlaylistDetails = (name) => {
    const update = async() => {
      try {
        const currentDetails = await localforage.getItem("_playlist_details")
        await localforage.setItem(`_playlist_details`, {
          ...currentDetails,
          [name]: {
            allArtists: [],
            allSongs: [],
            allSongDurations: [],
            totalLength: 0,
            coverArt: "../src/images/default_album_cover.png",
          }
        })
      }
      catch (err) {
        console.error(err)
      }
    }
    update()
  }
  
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
    while(playlistList.includes(name))
      name = `${baseName} (${checkCount+=1})`
    return name
  }

  const getRenameRequest = (reqID) => {
    setEnableRenameMode(true)
    setRenameRequestID(reqID)
    console.log("Rename request for:", reqID.split('_')[1])
  }

  const clearRenameRequestID = () => {
    setRenameRequestID("")
  }

  const replaceOldPlaylistName = (oldName, newName) => {
    let allNames = playlistList
    allNames[allNames.indexOf(oldName)] = newName
    setPlaylistList(allNames)
  }

  const getDeleteRequest = (reqID) => {
    const name = reqID.split('_')[1]
    deletePlaylist(name)
    removeViewedPlaylist(name)
  }

  const deletePlaylist = async(name) => {
    setPlaylistList(playlistList.filter((n) => n != name))
    let allPlaylists = await localforage.getItem("_playlist_all")
    let allDetails = await localforage.getItem("_playlist_details")
    allPlaylists = allPlaylists.filter((p) => p != name)
    delete allDetails[name]
    await localforage.setItem("_playlist_all", allPlaylists)
    await localforage.setItem("_playlist_details", allDetails)
    const keys = await localforage.keys()
    for(const key of keys){
      if(!key.includes(`${name}: `)) return
      await localforage.removeItem(key)
    }
    console.log("Deleted playlist:", `"${name}"`)
  }

  const setDraggedPlaylist = (name) => {
    draggedPlaylist.current = name
  }

  const setDraggedPlaylistTarget = (name) => {
    draggedPlaylistTarget.current = name
  }
  
  const rearrangePlaylists = () => {
    rearrangeMenuItems([[...playlistList]], [setPlaylistList], draggedPlaylist, draggedPlaylistTarget)
    setDraggedPlaylist("")
    setDraggedPlaylistTarget("")
  }
  
  return (
    <aside className="playlistMenu"
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
      </div><hr/>
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
          <button title='Create new playlist'
            onClick={() => {
              setDropdownOpened(true)
              setPlaylistList([renameDuplicate("New playlist"), ...playlistList])
              createNewPlaylistDetails(renameDuplicate("New playlist"))
            }}>
            <Add size={20} color='lightgrey'/>
          </button>
        </div>
      </div>
      <div className="playlistContainer">
        {playlistList.map((name) => (dropdownOpened && name.toLowerCase().includes(searchEntry.toLowerCase())) && 
          <MenuItem
            key={`${name}_${Math.ceil(Math.pow(10, 10) * Math.random() * Math.random())}`} 
            name={name}
            enableRenameMode={renameRequestID === "pl_"+name ? enableRenameMode : false}
            renameDuplicate={renameDuplicate}
            playlistList={playlistList}
            positionContextMenu={positionContextMenu}
            setDraggedPlaylist={setDraggedPlaylist}
            setDraggedPlaylistTarget={setDraggedPlaylistTarget}
            rearrangePlaylists={rearrangePlaylists}
            replaceOldPlaylistName={replaceOldPlaylistName}
            clearRenameRequestID={clearRenameRequestID}
          />)
        }
        <MenuItemContextMenu
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
