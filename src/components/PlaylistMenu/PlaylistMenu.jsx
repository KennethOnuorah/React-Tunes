import { useState, useRef, useEffect, createContext, useContext } from 'react'
import { useUpdateEffect } from 'react-use'
import { MenuContext } from '../../App'
import { rearrangeMenuItems } from '../../utils/components/PlaylistMenu/Rearrange'

import * as localforage from "localforage"

import { SiApplemusic as AppLogo } from 'react-icons/si'
import { BiSun as Sun, BiMoon as Moon } from 'react-icons/bi'
import { BsGithub as GitHub } from 'react-icons/bs'
import { SlMagnifier as Search } from 'react-icons/sl'
import { HiChevronRight as Open, HiChevronDown as Close } from 'react-icons/hi'
import { MdOutlineAdd as Add } from 'react-icons/md'

import MenuItem from './MenuItem/MenuItem'
import './PlaylistMenu.css'

export const MenuItemContext = createContext()
const PlaylistMenu = (props) => {
  const [dropdownOpened, setDropdownOpened] = useState(true)
  const [playlistList, setPlaylistList] = useState([])
  const [searchEntry, setSearchEntry] = useState("")

  const { removeViewedPlaylist, deletedPlaylist, updateDeletedPlaylist } = useContext(MenuContext)

  const draggedPlaylist = useRef("") 
  const draggedPlaylistTarget = useRef("")

  useEffect(() => {
    const getPlaylists = async() => {
      const list = await localforage.getItem("_playlist_all")
      setPlaylistList(!list ? [] : [...list])
    }
    getPlaylists()
  }, [])

  useUpdateEffect(() => {
    const savePlaylistList = async() => {
      await localforage.setItem("_playlist_all", [...playlistList])
      console.log(`Playlist list saved (${new Date().toLocaleTimeString()})\n`, playlistList)
    }
    savePlaylistList()
  }, [playlistList.join("")])

  useUpdateEffect(() => {
    deletePlaylist(deletedPlaylist)
  }, [deletedPlaylist])

  const createNewPlaylistDetails = async(name) => {
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
  
  const handleSearching = (e) => {
    setSearchEntry(e.target.value)
    setDropdownOpened(e.target.value != '' ? true : dropdownOpened)
  }

  const renameDuplicate = (name) => {
    let checkCount = 0
    let baseName = name
    while(playlistList.includes(name))
      name = `${baseName} (${checkCount+=1})`
    return name
  }

  const replaceOldPlaylistName = (oldName, newName) => {
    let allNames = playlistList
    allNames[allNames.indexOf(oldName)] = newName
    setPlaylistList([...allNames])
  }

  const deletePlaylist = async(name) => {
    if(!confirm(`Playlist "${name}" will be deleted. Press OK to proceed.`)) return
    removeViewedPlaylist(name)
    updateDeletedPlaylist(name)
    setPlaylistList(playlistList.filter((n) => n != name))
    let playlists = await localforage.getItem("_playlist_all")
    let playlistDetails = await localforage.getItem("_playlist_details")
    playlists = playlists.filter((p) => p != name)
    delete playlistDetails[name]
    await localforage.setItem("_playlist_all", playlists)
    await localforage.setItem("_playlist_details", playlistDetails)
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
    draggedPlaylist.current = ""
    draggedPlaylistTarget.current = ""
  }
  
  return (
    <aside className="playlistMenu">
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
          <input type="search" placeholder='Search playlists . . .' onInput={handleSearching}/>
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
        {
        playlistList.map((name) => (dropdownOpened && name.toLowerCase().includes(searchEntry.toLowerCase())) && 
          <MenuItem
            key={`${name}_${Math.ceil(Math.pow(10, 10) * Math.random() * Math.random())}`} 
            name={name}
            renameDuplicate={renameDuplicate}
            deletePlaylist={deletePlaylist}
            setDraggedPlaylist={setDraggedPlaylist}
            setDraggedPlaylistTarget={setDraggedPlaylistTarget}
            rearrangePlaylists={rearrangePlaylists}
            replaceOldPlaylistName={replaceOldPlaylistName}
          />)
        }
      </div>
    </aside>
  )
}

export default PlaylistMenu
