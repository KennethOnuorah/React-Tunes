import { useRef, useState, useContext } from 'react'
import usePostInitialEffect from '../../../hooks/usePostInitialEffect'
import { MenuItemContext } from '../PlaylistMenu'

import { AiOutlineFolder as Icon } from 'react-icons/ai'
import { IoCheckmarkCircleOutline as ConfirmRename, IoCloseCircleOutline as CancelRename} from 'react-icons/io5'

import './PlaylistMenuItem.css'

const PlaylistMenuItem = (props) => {
  const [playlistName, setPlaylistName] = useState(props.name)
  const [renameMode, setRenameMode] = useState(props.enableRenameMode)
  const { 
    playlistList, 
    positionContextMenu, 
    setDraggedPlaylist, 
    setDraggedPlaylistTarget, 
    rearrangePlaylists, 
    replaceOldPlaylistName, 
    clearRenameRequestID,
    renameDuplicate } = useContext(MenuItemContext)
  const newName = useRef("")
  const oldName = useRef("")
  const itemRef = useRef(0)

  //For saving & updated playlist names
  usePostInitialEffect(() => {
    const saveName = async() => {
      const res = await fetch("http://localhost:5000/playlistsCreated", {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          list: [...playlistList]
        })
      })
      const data = await res.json()
      console.log("Updated playlist names:", data)
    }
    saveName()
  }, [playlistName])

  return (
    <div className='playlistMenuItem' id={`pl_${playlistName}`} ref={itemRef}
      onContextMenu={(e) => {
        e.preventDefault()
        if(!renameMode)
          positionContextMenu(e.pageX, e.pageY, itemRef)
      }}
      onDragStart={() => { setDraggedPlaylist(playlistName) }}
      onDragEnd={() => { rearrangePlaylists() }}
      onDragOver={(e) => {
        e.preventDefault()
        setDraggedPlaylistTarget(playlistName)
      }}
      onDragExit={() => { setDraggedPlaylistTarget("") }}
      draggable={renameMode ? false : true}>
      <div className="playlistMenuItemLeft">
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
      <div className="playlistMenuItemRight">
        <button
          className='confirmRename'
          onClick={() => {
            if(newName.current !== ''){
              clearRenameRequestID()
              oldName.current = playlistName
              newName.current = renameDuplicate(newName.current)
              setPlaylistName(newName.current)
              replaceOldPlaylistName(oldName.current, newName.current)
              console.log("Renaming completed for:", `"${oldName.current}"`, "\nNew name is:", `"${newName.current}"`)
              newName.current = ""
              setRenameMode(false)
            }
          }
        }>
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
          }
        }>
          <CancelRename 
            size={20}
            style={{ display: renameMode ? 'flex' : 'none' }}
          />
        </button>
      </div>
    </div>
  )
}

export default PlaylistMenuItem