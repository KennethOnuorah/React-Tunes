import { useState, useEffect, createContext } from "react"
import { useUpdateEffect } from "react-use"
import { Helmet } from "react-helmet"
import * as localforage from "localforage"

import PlaylistMenu from "./components/PlaylistMenu/PlaylistMenu"
import PlaylistViewer from "./components/PlaylistViewer/PlaylistViewer"
import MusicController from "./components/MusicController/MusicController"
import "./App.css"

export const MenuContext = createContext()
export const ViewerContext = createContext()
function App() {
  const [darkTheme, setDarkTheme] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false) //Controls the opening and closing of the playlist viewer
  const [details, setDetails] = useState({ //The playlist information that is displayed in the viewer header
    name: "-",
    artists: [],
    songCount: 0,
    length: 0,
    artSrc: "",
  })
  const [artistsText, setArtistsText] = useState("")
  const [requestedDeletionFromViewer, setRequestedDeletionFromViewer] = useState("")

  const toggleDarkTheme = () => setDarkTheme(!darkTheme)
  const deletePlaylistFromViewer = (name) => setRequestedDeletionFromViewer(name)

  //Display a playlist in the viewer with provided information
  const viewPlaylist = (name, artists, songCount, length, src) => {
    setViewerOpen(true)
    setDetails({
      name: name,
      artists: artists,
      songCount: songCount,
      length: length,
      artSrc: src,
    })
  }

  //Update the playlist currently displayed in the viewer, if necessary
  //Usually used when renaming a menu item
  const updateViewedPlaylist = (updates, requestedPlaylist) => {
    if (details.name !== requestedPlaylist) return
    const updatedDetails = {...details, ...updates}
    viewPlaylist(
      updatedDetails.name,
      updatedDetails.artists,
      updatedDetails.songCount,
      updatedDetails.length,
      updatedDetails.artSrc
    )
  }

  //Removes the playlist currently displayed in the viewer, if necessary
  const removeViewedPlaylist = (requestedPlaylist) => {
    if (details.name !== requestedPlaylist) return
    setDetails({
      name: "-",
      artists: [],
      songCount: 0,
      length: 0,
      artSrc: "",
    })
    setViewerOpen(false)
  }

  //Set theme on app initialization
  useEffect(() => {
    const setTheme = async () => {
      try {
        const theme = await localforage.getItem("_dark_theme")
        setDarkTheme(theme === null ? false : theme)
      } catch (err) {
        console.error(err)
      }
    }
    setTheme()
  }, [])

  //Updating the list of artists text in header
  useEffect(() => {
    setArtistsText(
      details.artists.length > 0
        ? `${details.artists
            .filter((a) => details.artists.indexOf(a) < 3)
            .join(", ")}` +
            (details.artists.length > 3
              ? `, and ${details.artists.length - 3} other${
                  details.artists.length - 3 != 1 ? "s" : ""
                }`
              : ``)
        : "No artists"
    )
  }, [details.artists.join()])

  //For saving and updating the color theme
  useUpdateEffect(() => {
    const saveTheme = async () => {
      try {
        await localforage.setItem("_dark_theme", darkTheme)
        console.log("Dark theme has been set to", darkTheme)
      } catch (err) {
        console.error(err)
      }
    }
    saveTheme()
  }, [darkTheme])

  return (
    <div className="App">
      <Helmet
        bodyAttributes={{
          style: `background-color: ${!darkTheme ? "white" : "#303030"}`,
        }}
      />
      <MenuContext.Provider
        value={{
          viewPlaylist,
          updateViewedPlaylist,
          removeViewedPlaylist,
          requestedDeletionFromViewer
        }}
      >
        <PlaylistMenu darkTheme={darkTheme} toggleDarkTheme={toggleDarkTheme} />
      </MenuContext.Provider>
      <ViewerContext.Provider
        value={{
          updateViewedPlaylist, 
          removeViewedPlaylist,
          artistsText,
          deletePlaylistFromViewer,
          details
        }}
      >
        {viewerOpen && (
          <PlaylistViewer darkTheme={darkTheme} details={details} />
        )}
      </ViewerContext.Provider>
      <MusicController darkTheme={darkTheme} />
    </div>
  )
}

export default App
