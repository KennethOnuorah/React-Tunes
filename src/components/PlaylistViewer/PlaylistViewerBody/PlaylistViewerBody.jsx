import Song from "./Song/Song"
import "./PlaylistViewerBody.css"

const PlaylistViewerBody = (props) => {
  return (
    <section className="playlistViewerBody">
      <Song darkTheme={props.darkTheme}/>
      <Song darkTheme={props.darkTheme}/>
      <Song darkTheme={props.darkTheme}/>
      <Song darkTheme={props.darkTheme}/>
      <Song darkTheme={props.darkTheme}/>
    </section>
  )
}

export default PlaylistViewerBody
