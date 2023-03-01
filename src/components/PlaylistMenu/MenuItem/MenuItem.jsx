import { useRef, useState, useContext } from 'react'
import { MenuItemContext } from '../PlaylistMenu'
import { MenuContext } from '../../../App'

import { AiOutlineFolder as Icon } from 'react-icons/ai'
import { IoCheckmarkCircleOutline as ConfirmRename, IoCloseCircleOutline as CancelRename} from 'react-icons/io5'

import './MenuItem.css'
import * as localforage from 'localforage'

const MenuItem = (props) => {
  const [playlistName, setPlaylistName] = useState(props.name)
  const [renameMode, setRenameMode] = useState(props.enableRenameMode)
  const { positionContextMenu, 
    setDraggedPlaylist, 
    setDraggedPlaylistTarget, 
    rearrangePlaylists, 
    replaceOldPlaylistName, 
    clearRenameRequestID,
    renameDuplicate } = useContext(MenuItemContext)
  const { viewPlaylist, updateViewedPlaylist } = useContext(MenuContext)
  const newName = useRef("")
  const oldName = useRef("")
  const itemRef = useRef()

  const updatePlaylistName = async() => {
    if(newName.current !== ''){
      doRename(clearRenameRequestID, oldName, playlistName, setPlaylistName, renameDuplicate, newName, renameDetailsName, updateViewedPlaylist, replaceOldPlaylistName, setRenameMode)
      const keys = await localforage.keys()
      const songNames = keys.map((k) => k.split(': ')[0].includes(oldName.current) && k.split(': ')[1]).filter((t) => typeof(t) != "boolean")
      for(let i = 0; i < songNames.length; i++){
        const b64 = await localforage.getItem(`${oldName.current}: ${songNames[i]}`)
        await localforage.setItem(`${newName.current}: ${songNames[i]}`, b64)
        localforage.removeItem(`${oldName.current}: ${songNames[i]}`)
      }
      newName.current = ""
    }
  }

  const doRename = (clearRenameRequestID, oldName, playlistName, setPlaylistName, renameDuplicate, newName, renameDetailsName, updateViewedPlaylist, replaceOldPlaylistName, setRenameMode) => {
    clearRenameRequestID()
    oldName.current = playlistName
    setPlaylistName(renameDuplicate(newName.current))
    renameDetailsName(oldName.current, newName.current)
    updateViewedPlaylist({
      name: renameDuplicate(newName.current)
    }, playlistName)
    replaceOldPlaylistName(oldName.current, newName.current)
    console.log("Renaming completed for:", `"${oldName.current}"`, "\nNew name is:", `"${newName.current}"`)
    setRenameMode(false)
  }

  const renameDetailsName = async(oldName, newName) => {
    try {
      const playlistDetails = await localforage.getItem(`_playlist_details`)
      playlistDetails[newName] = playlistDetails[oldName]
      delete playlistDetails[oldName]
      await localforage.setItem(`_playlist_details`, playlistDetails)
      console.log(`Updated /_playlist_details with renamed key: \n"${oldName}" -> "${newName}"`)
    }
    catch (err) {
      console.error(err)
    }
  }
  
  return (
    <div 
      className='menuItem' 
      id={`pl_${playlistName}`} 
      ref={itemRef}
      onClick={async() => {
        if(!renameMode){
          const details = await localforage.getItem(`_playlist_details`)
          viewPlaylist(
            playlistName, 
            details[playlistName]["allArtists"],
            details[playlistName]["allSongs"].length,
            details[playlistName]["totalLength"],
            details[playlistName]["coverArt"])
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        if(!renameMode)
          positionContextMenu(e.pageX, e.pageY, itemRef)
      }}
      onDragStart={() => setDraggedPlaylist(playlistName)}
      onDragEnd={() => rearrangePlaylists()}
      onDragOver={(e) => {
        e.preventDefault()
        setDraggedPlaylistTarget(playlistName)
      }}
      onDragExit={() => setDraggedPlaylistTarget("")}
      draggable={renameMode ? false : true}>
      <div className="menuItemLeft">
        <Icon color='lightgrey' size={25}/>
        <button style={{ display: renameMode ? 'none' : 'flex' }}>
          {playlistName}
        </button>
        <input className='renamePlaylistField' type={'text'} defaultValue={playlistName}
          style={{
            display: renameMode ? 'flex' : 'none'
          }}
          onInput={(e) => newName.current = e.target.value}
        />
      </div>
      <div className="menuItemRight">
        <button
          className='confirmRename'
          onClick={updatePlaylistName}>
          <ConfirmRename 
            size={20} 
            style={{ display: renameMode ? 'flex' : 'none' }}
          />
        </button>
        <button
          className='cancelRename'
          onClick={() => {
            clearRenameRequestID()
            newName.current = ""
            setRenameMode(false)
            console.log("Renaming cancelled for:", `"${playlistName}"`)
          }}
        >
          <CancelRename 
            size={20}
            style={{ display: renameMode ? 'flex' : 'none' }}
          />
        </button>
      </div>
    </div>
  )
}

export default MenuItem
