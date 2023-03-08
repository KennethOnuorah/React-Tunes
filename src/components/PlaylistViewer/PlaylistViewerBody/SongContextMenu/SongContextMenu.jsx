import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { TbTrash as Remove } from 'react-icons/tb'
import './SongContextMenu.css'

const SongContextMenu = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const setToInvisible = () => setVisible(false)

  useImperativeHandle(ref, () => ({
    setInvisible: setToInvisible
  }))

  //Set the visibility to true every time the position changes
  useEffect(() => {
    setVisible(props.xPos + props.yPos !== 0 && true)
  }, [props.xPos, props.yPos])

  return (
    <div 
      className='songContextMenu'
      style={{
        transform: `translate(${props.xPos}px, ${props.yPos}px)`,
        visibility: visible ? 'visible' : 'hidden'
      }}
    >
      <button
        className='removeSongBtn'
        onClick={() => {}}
      >
        <Remove size={20}/>
        Remove song
      </button>
    </div>
  )
})

export default SongContextMenu
