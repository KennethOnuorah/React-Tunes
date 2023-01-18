import { useState } from "react"

import PlaylistViewerHeader from "../PlaylistViewerHeader/PlaylistViewerHeader"
import PlaylistViewerBody from "../PlaylistViewerBody/PlaylistViewerBody"
import './PlaylistViewer.css'

const AlbumViewer = () => {
  return (
    <div className="albumViewerContainer">
      <PlaylistViewerHeader/>
      <PlaylistViewerBody/>
    </div>
  )
}

export default AlbumViewer
