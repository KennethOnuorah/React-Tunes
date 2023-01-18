import { useRef, useState } from 'react'

import { AiOutlineFolder as Icon } from 'react-icons/ai'
import { IoCheckmarkCircleOutline as ConfirmRename, IoCloseCircleOutline as CancelRename} from 'react-icons/io5'

import './PlaylistMenuItem.css'

const PlaylistMenuItem = (props) => {
  const [playlistName, setPlaylistName] = useState(props.name)
  const [renameMode, setRenameMode] = useState(props.enableRenameMode)
  const newName = useRef("")
  const oldName = useRef("")
  const itemRef = useRef(0)

  return (
    <div 
      className='playlistMenuItem'
      id={`pl_${playlistName}`}
      ref={itemRef}
      onContextMenu={(e) => {
        e.preventDefault()
        if(!renameMode)
          props.handleContextMenu(e.pageX, e.pageY, itemRef)
      }}
      onDragStart={() => {
        props.setDraggedPlaylist(playlistName)
      }}
      onDragEnd={() => {
        props.rearrangePlaylists()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        props.setDraggedPlaylistTarget(playlistName)
      }}
      onDragExit={() => {
        props.setDraggedPlaylistTarget("")
      }}
      onDrop={()=>{}}
      draggable={renameMode ? false : true}>
      <div className="playlistMenuItemLeft">
        <Icon color='lightgrey' size={25}/>
        <button style={{
          display: renameMode ? 'none' : 'flex'
        }}>
          {playlistName}
        </button>
        <input  
          className='renamePlaylistField'
          type={'text'} 
          placeholder='Rename . . .'
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
              props.clearRenameRequestID()
              oldName.current = playlistName
              newName.current = props.renameDuplicate(newName.current)
              setPlaylistName(newName.current)
              props.replaceOldPlaylistName(oldName.current, newName.current)
              console.log("Renaming completed for:", `pl_${oldName.current}`, "\nNew name is:", `pl_${newName.current}`)
              newName.current = ""
              setRenameMode(false)
            }
          }
        }>
          <ConfirmRename 
            size={20} 
            style={{
              display: renameMode ? 'flex' : 'none'
            }}/>
        </button>
        <button
          className='cancelRename'
          onClick={() => {
            props.clearRenameRequestID()
            newName.current = ""
            setRenameMode(false)
            console.log("Renaming cancelled for:", `pl_${playlistName}`)
          }
        }>
          <CancelRename 
            size={20}
            style={{
              display: renameMode ? 'flex' : 'none'
            }}/>
        </button>
      </div>
    </div>
  )
}

export default PlaylistMenuItem