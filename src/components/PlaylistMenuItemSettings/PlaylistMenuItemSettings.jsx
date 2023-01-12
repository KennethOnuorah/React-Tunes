import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { TbEdit as Rename, TbTrash as Delete } from 'react-icons/tb'
import './PlaylistMenuItemSettings.css'

const PlaylistMenuItemSettings = ({ xPos, yPos, targetElementID, getRenameRequest }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    //Set the visibility to true every time the position changes
    //We do not want it to enable on the initial render, so it won't be visible if it's position is (0px, 0px), which is its initial position
    setVisible(xPos + yPos !== 0 && true)
  }, [xPos, yPos])

  return (
    <div 
      className="playlistMenuItemSettings"
      style={{
        transform: `translate(${xPos}px, ${yPos}px)`,
        visibility: visible ? 'visible' : 'hidden'
      }}>
      <button 
        onClick={() => {
          setVisible(false)
          getRenameRequest(targetElementID)
        }
      }>
        <Rename size={20}/>
        Rename playlist
      </button>
      <button>
        <Delete size={20}/>
        Delete playlist
      </button>
    </div>
  )
}

PlaylistMenuItemSettings.propTypes = {
  xPos: PropTypes.number.isRequired,
  yPos: PropTypes.number.isRequired,
  targetElementID: PropTypes.string.isRequired,
  getRenameRequest: PropTypes.func.isRequired
}

export default PlaylistMenuItemSettings
