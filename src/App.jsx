import { useState } from "react"
import { Helmet } from "react-helmet"

import PlaylistMenu from "./components/PlaylistMenu/PlaylistMenu"
import PlaylistViewer from "./components/PlaylistViewer/PlaylistViewer"
import './App.css'

function App() {
  const [darkTheme, setDarkTheme] = useState(false)

  const toggleDarkTheme = () => setDarkTheme(!darkTheme)

  return (
    <div className="App">
      <Helmet bodyAttributes={{
        style: `background-color: ${!darkTheme ? "white" : "#303030"}`
      }}/>
      <PlaylistMenu
        darkTheme={darkTheme}
        toggleDarkTheme={toggleDarkTheme}/>
      <PlaylistViewer
        darkTheme={darkTheme}/>
    </div>
  )
}

export default App
