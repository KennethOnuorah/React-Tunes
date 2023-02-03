import {useEffect, useRef } from "react"
import { HiOutlineClock as Time } from "react-icons/hi"

import PlaylistViewerHeader from "./PlaylistViewerHeader/PlaylistViewerHeader"
import PlaylistViewerBody from "./PlaylistViewerBody/PlaylistViewerBody"
import './PlaylistViewer.css'

const PlaylistViewer = (props) => {
  const labelsRef = useRef()
  const hrRef = useRef()

  useEffect(() => {
    const updateColorTheme = () => {
      if(props.darkTheme){
        labelsRef.current.classList.add("darkThemeBorderLabels")
        hrRef.current.classList.add("darkThemeBorderHR")
        return
      }
      labelsRef.current.classList.remove("darkThemeBorderLabels")
      hrRef.current.classList.remove("darkThemeBorderHR")
    }
    updateColorTheme()
  }, [props.darkTheme])

  return (
    <section className="playlistViewerContainer">
      <PlaylistViewerHeader 
        darkTheme={props.darkTheme}
        playlistTitle='-'/>
      <div className="viewerBodyBorder">
        <div 
          className="borderLabels"
          ref={labelsRef}>
          <div className="leftLabels">  
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
      <PlaylistViewerBody darkTheme={props.darkTheme}/>
    </section>
  )
}

export default PlaylistViewer
