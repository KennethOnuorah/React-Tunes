import { useState, useEffect, createContext } from "react"
import { useUpdateEffect } from "react-use"
import { Helmet } from "react-helmet"

import PlaylistMenu from "./components/PlaylistMenu/PlaylistMenu"
import PlaylistViewer from "./components/PlaylistViewer/PlaylistViewer"
import MusicController from "./components/MusicController/MusicController"
import './App.css'

// export const PlaylistViewerContext = createContext()
function App() {
  const [darkTheme, setDarkTheme] = useState(false)
  const toggleDarkTheme = () => setDarkTheme(!darkTheme)

  //Set theme on app initialization
  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await fetch("http://localhost:5000/darkTheme")
        const theme = await res.json()
        setDarkTheme(theme.enabled)  
      }
      catch(err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  //For saving and updating the color theme
  useUpdateEffect(() => {
    const saveTheme = async() => {
      try {
        const res = await fetch(`http://localhost:5000/darkTheme`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            enabled: darkTheme
          })
        })
        const data = await res.json()
        console.log("Dark app theme currently set to:", data.enabled)
      }
      catch(err) {
        console.error(err)
      }
    }
    saveTheme()
  }, [darkTheme])

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
      <MusicController darkTheme={darkTheme}/>
    </div>
  )
}

export default App
