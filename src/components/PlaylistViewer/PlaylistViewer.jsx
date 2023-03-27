import { useEffect, useState } from "react"
import { HiOutlineClock as Time } from "react-icons/hi"

import PlaylistViewerHeader from "./PlaylistViewerHeader/PlaylistViewerHeader"
import PlaylistViewerBody from "./PlaylistViewerBody/PlaylistViewerBody"
import "./PlaylistViewer.css"

const PlaylistViewer = (props) => {
  const [viewedDetails, setViewedDetails] = useState({})

  useEffect(() => {
    setViewedDetails({...props.details})
  }, [props.details])

  return (
    <section className="playlistViewerContainer">
      <PlaylistViewerHeader darkTheme={props.darkTheme} details={viewedDetails}/>
      <div className="viewerBodyBorder">
        <div className={`borderLabels${props.darkTheme ? " darkThemeBorderLabels" : ""}`}>
          <div className="leftLabels">Title & Artist</div>
          <Time/>
        </div>
      </div>
      <hr
        className={`borderHR${props.darkTheme ? " darkThemeBorderHR" : ""}`}
        style={{
          marginTop: "15px",
        }}
      />
      <PlaylistViewerBody darkTheme={props.darkTheme} details={viewedDetails}/>
    </section>
  )
}

export default PlaylistViewer
