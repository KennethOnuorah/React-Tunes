import { useRef, useState, useContext } from 'react'
import { MenuContext } from '../../../App'

import * as localforage from 'localforage'

import { AiOutlineFolder as ItemIcon } from 'react-icons/ai'
import { FaRegEdit as Edit } from 'react-icons/fa'
import { 
  IoCheckmarkCircleOutline as ConfirmRename, 
  IoCloseCircleOutline as CancelRename,
  IoTrashOutline as Trash,
} from 'react-icons/io5'

import './MenuItem.css'

const MenuItem = (props) => {
  const [playlistName, setPlaylistName] = useState(props.name)
  const [renameMode, setRenameMode] = useState(false)
  const [hoveredOver, setHoveredOver] = useState(false)
  const { 
    viewPlaylist, 
    updateViewedPlaylist,
    renameForStartedPlaylist,
    setRenameForStartedPlaylist 
  } = useContext(MenuContext)
  const newName = useRef("")

  const updatePlaylistNameDisplay = async() => {
    const oldName = playlistName
    if(newName.current !== ''){
      doRename(oldName)
      const keys = await localforage.keys()
      const songNames = keys.map((k) => k.split(': ')[0].includes(oldName) && 
        k.split(': ')[1]).filter((t) => typeof(t) != "boolean"
      )
      for(let i = 0; i < songNames.length; i++){
        const b64 = await localforage.getItem(`${oldName}: ${songNames[i]}`)
        await localforage.setItem(`${newName.current}: ${songNames[i]}`, b64)
        localforage.removeItem(`${oldName}: ${songNames[i]}`)
      }
    }
  }

  const doRename = async(oldName) => {
    setPlaylistName(props.renameDuplicate(newName.current))
    const currentStartedPlaying = await localforage.getItem("_current_playlist_playing")
    setRenameForStartedPlaylist(
      (oldName === currentStartedPlaying && currentStartedPlaying !== "") ? 
        newName.current : renameForStartedPlaylist
    )
    await localforage.setItem("_current_playlist_playing", 
      (oldName === currentStartedPlaying && currentStartedPlaying !== "") ? 
        newName.current : currentStartedPlaying
    )
    updatePlaylistDetails(oldName, newName.current)
    updateViewedPlaylist({name: props.renameDuplicate(newName.current)}, playlistName)
    props.replaceOldPlaylistName(oldName, newName.current)
    console.log("Renaming completed for:", `"${oldName}"`, "\nNew name is:", `"${newName.current}"`)
    setRenameMode(false)
  }

  const updatePlaylistDetails = async(oldName, newName) => {
    const playlistDetails = await localforage.getItem(`_playlist_details`)
    playlistDetails[newName] = playlistDetails[oldName]
    delete playlistDetails[oldName]
    await localforage.setItem(`_playlist_details`, playlistDetails)
  }
  
  return (
    <div 
      className='menuItem' 
      onDragStart={() => props.setDraggedPlaylist(playlistName)}
      onDragEnd={() => props.rearrangePlaylists()}
      onDragOver={(e) => {
        e.preventDefault()
        props.setDraggedPlaylistTarget(playlistName)
      }}
      onDragExit={() => props.setDraggedPlaylistTarget("")}
      draggable={renameMode ? false : true}
    >
      <div className="menuItemLeft">
        <ItemIcon color='lightgrey' size={25}/>
        <button
          onClick={async() => {
            if(!renameMode){
              const details = await localforage.getItem(`_playlist_details`)
              viewPlaylist(
                playlistName, 
                details[playlistName]["allArtists"],
                details[playlistName]["allSongs"].length,
                details[playlistName]["totalLength"],
                details[playlistName]["coverArt"]
              )
            }
          }}
          style={{ display: renameMode ? 'none' : 'flex', width: "125px" }}
        >
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
        {
        renameMode?
          <div className='menuItemEditButtons'>
            <button
              className='confirmRename'
              onClick={updatePlaylistNameDisplay}
            >
              <ConfirmRename size={20}/>
            </button>
            <button
              className='cancelRename'
              onClick={() => {
                newName.current = ""
                setRenameMode(false)
                console.log("Renaming cancelled for:", `"${playlistName}"`)
              }}
            >
              <CancelRename size={20}/>
            </button>
          </div> :
          <div
            className='menuItemDefaultButtons'
            onMouseOver={() => setHoveredOver(true)}
            onFocus={() => setHoveredOver(true)}
            onMouseLeave={() => setHoveredOver(false)}
            onBlur={() => setHoveredOver(false)}
            style={{
              opacity: hoveredOver ? "1" : "0",
              transition: "opacity 0.1s ease-in-out"
            }}
          >
            <button
              title='Rename playlist'
              onClick={() => setRenameMode(!renameMode)}
            >
              <Edit size={20}/>
            </button>
            <button
              title='Delete playlist'
              onClick={() => props.deletePlaylist(playlistName)}
            >
              <Trash size={20}/>
            </button> 
          </div>
        }
      </div>
    </div>
  )
}

export default MenuItem
