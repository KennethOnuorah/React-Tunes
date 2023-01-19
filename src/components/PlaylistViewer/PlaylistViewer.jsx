import { useEffect, useRef } from "react"
import { HiOutlineClock as Time, HiOutlineHashtag as SongNumber} from "react-icons/hi"

import PlaylistViewerHeader from "../PlaylistViewerHeader/PlaylistViewerHeader"
import PlaylistViewerBody from "../PlaylistViewerBody/PlaylistViewerBody"
import './PlaylistViewer.css'

const AlbumViewer = (props) => {
  const labelsRef = useRef()
  const hrRef = useRef()

  useEffect(() => {
    props.darkTheme ? labelsRef.current.classList.add("darkThemeBorderLabels") : labelsRef.current.classList.remove("darkThemeBorderLabels")
    props.darkTheme ? hrRef.current.classList.add("darkThemeBorderHR") : hrRef.current.classList.remove("darkThemeBorderHR")
  }, [props.darkTheme])

  return (
    <div className="albumViewerContainer">
      <PlaylistViewerHeader
        darkTheme={props.darkTheme}/>
      <div className="viewerBodyBorder">
        <div 
          className="borderLabels"
          ref={labelsRef}>
          <div 
            className="leftLabels">  
            <SongNumber/>
            Title & Artist
          </div>
          <Time/>
        </div>
      </div>
      <hr 
        className="borderHR"
        ref={hrRef}
        style={{
          marginTop: "15px",
        }}/>
      <PlaylistViewerBody/>
    </div>
  )
}

export default AlbumViewer
