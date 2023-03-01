import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'

import { TbEdit as Rename, TbTrash as Delete } from 'react-icons/tb'
import './MenuItemContextMenu.css'

const MenuItemContextMenu = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const setInvisible = () => setVisible(false)

  useImperativeHandle(ref, () => ({
    setInvisible: setInvisible
  }))

  useEffect(() => {
    //Set the visibility to true every time the position changes
    //We do not want it to enable on the initial render, so it won't be visible if it's position is (0px, 0px), which is its initial position
    setVisible(props.xPos + props.yPos !== 0 && true)
  }, [props.xPos, props.yPos])

  return (
    <div 
      className="menuItemContextMenu"
      style={{
        transform: `translate(${props.xPos}px, ${props.yPos}px)`,
        visibility: visible ? 'visible' : 'hidden'
      }}>
      <button
        className='renamePlaylistBtn'
        onClick={() => {
          setVisible(false)
          props.getRenameRequest(props.targetElementID)
        }
      }>
        <Rename size={20}/>
        Rename playlist
      </button>
      <button
        className='deletePlaylistBtn'
        onClick={() => {
          setVisible(false)
          props.getDeleteRequest(props.targetElementID)
        }}
      >
        <Delete size={20}/>
        Delete playlist
      </button>
    </div>
  )
})

export default MenuItemContextMenu