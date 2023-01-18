import { useState } from "react"

import PlaylistMenu from "./components/PlaylistMenu/PlaylistMenu"
import PlaylistViewer from "./components/PlaylistViewer/PlaylistViewer"
import './App.css'

function App() {
  const [darkTheme, setDarkTheme] = useState(false)
  return (
    <div className="App">
      <PlaylistMenu/>
      <PlaylistViewer/>
    </div>
  )
}

export default App
