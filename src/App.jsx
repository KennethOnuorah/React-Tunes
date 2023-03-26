import { useState, useEffect, createContext } from "react"
import { useUpdateEffect } from "react-use"
import { Helmet } from "react-helmet"

import * as localforage from "localforage"

import PlaylistMenu from "./components/PlaylistMenu/PlaylistMenu"
import PlaylistViewer from "./components/PlaylistViewer/PlaylistViewer"
import MusicController from "./components/MusicController/MusicController"

import "./App.css"

const initialTheme = await localforage.getItem("_dark_theme")
export const MenuContext = createContext()
export const ViewerContext = createContext()
function App() {
  const [darkTheme, setDarkTheme] = useState(initialTheme)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [details, setDetails] = useState({
    name: "-",
    artists: [],
    songCount: 0,
    length: 0,
    artSrc: "",
  })
  const [artistsText, setArtistsText] = useState("")
  const [requestedDeletionFromViewer, setRequestedDeletionFromViewer] = useState("")
  const [startedPlaylist, setStartedPlaylist] = useState("")
  const [renameForStartedPlaylist, setRenameForStartedPlaylist] = useState("")

  const toggleDarkTheme = () => setDarkTheme(!darkTheme)
  const deleteMenuItemFromViewer = (name) => setRequestedDeletionFromViewer(name)
  const startNewPlaylist = (name) => setStartedPlaylist(name)

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

  useEffect(() => {
    const setTheme = async () => {
      const theme = await localforage.getItem("_dark_theme")
      setDarkTheme(theme === null ? false : theme)
    }
    setTheme()
  }, [])

  useEffect(() => {
    const uniqueList = Array.from(new Set(details.artists))
    setArtistsText(
      uniqueList.length > 0
        ? `${uniqueList.filter((a) => uniqueList.indexOf(a) < 3).join(", ")}` +
            (uniqueList.length > 3
              ? `, and ${uniqueList.length - 3} ${
                  uniqueList.length - 3 != 1 ? "others" : "more"
                }`
              : ``)
        : "No artists"
    )
  }, [details.artists.join()])

  useUpdateEffect(() => {
    const saveTheme = async () => {
      await localforage.setItem("_dark_theme", darkTheme)
      console.log("Dark theme has been set to", darkTheme)
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
          requestedDeletionFromViewer,
          setRenameForStartedPlaylist,
          renameForStartedPlaylist
      }}>
        <PlaylistMenu darkTheme={darkTheme} toggleDarkTheme={toggleDarkTheme} />
      </MenuContext.Provider>
      <ViewerContext.Provider
        value={{
          updateViewedPlaylist, 
          removeViewedPlaylist,
          artistsText,
          deleteMenuItemFromViewer,
          details,
          startNewPlaylist
        }}
      >
        {viewerOpen && (
          <PlaylistViewer darkTheme={darkTheme} details={details} />
        )}
      </ViewerContext.Provider>
      <MusicController 
        darkTheme={darkTheme}
        startedPlaylist={startedPlaylist}
        renameForStartedPlaylist={renameForStartedPlaylist}
        artistsText={artistsText}
        details={details}
      />
    </div>
  )
}

export default App
