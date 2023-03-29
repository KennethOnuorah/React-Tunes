import { useState, useEffect, createContext } from "react"
import { useUpdateEffect } from "react-use"
import { Helmet } from "react-helmet"

import * as localforage from "localforage"

import HomeScreen from "./components/HomeScreen/HomeScreen"
import LoadingScreen from "./components/LoadingScreen/LoadingScreen"
import PlaylistMenu from "./components/PlaylistMenu/PlaylistMenu"
import PlaylistViewer from "./components/PlaylistViewer/PlaylistViewer"
import MusicController from "./components/MusicController/MusicController"

import "./App.css"

const initialTheme = await localforage.getItem("_dark_theme")
export const MenuContext = createContext()
export const ViewerContext = createContext()
function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [darkTheme, setDarkTheme] = useState(initialTheme)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [details, setDetails] = useState({
    name: "-",
    artists: [],
    songCount: 0,
    length: 0,
    artSrc: "",
  })
  const [artistsText, setArtistsText] = useState("")
  const [startedPlaylist, setStartedPlaylist] = useState("")
  const [renameForStartedPlaylist, setRenameForStartedPlaylist] = useState("")
  const [currentSong, setCurrentSong] = useState("")
  const [chosenSong, setChosenSong] = useState("")
  const [deletedSong, setDeletedSong] = useState("")
  const [deletedPlaylist, setDeletedPlaylist] = useState("")
  const [rearrangementCount, setRearrangementCount] = useState(0)

  const setLoading = (enabled) => setIsLoading(enabled)
  const toggleSideMenuOpen = () => setSideMenuOpen(!sideMenuOpen)
  const toggleDarkTheme = () => setDarkTheme(!darkTheme)
  const startNewPlaylist = (name) => setStartedPlaylist(name)
  const updateCurrentSong = (name) => setCurrentSong(name)
  const selectSong = (name) => setChosenSong(name)
  const updateDeletedSong = (name) => setDeletedSong(name)
  const updateDeletedPlaylist = (name) => setDeletedPlaylist(name)
  const updateRearrangementCount = () => setRearrangementCount(rearrangementCount + 1)

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
    <div 
      className="App"
      onKeyDown={(e) => {
        if(isLoading)
          e.preventDefault()
      }}
    >
      <Helmet
        bodyAttributes={{
          style: `background-color: ${!darkTheme ? "white" : "#303030"}`,
        }}
      />
      <LoadingScreen isLoading={isLoading}/>
      <MenuContext.Provider 
        value={{
          viewPlaylist, 
          updateViewedPlaylist, 
          removeViewedPlaylist,
          updateDeletedPlaylist,
          deletedPlaylist,
          setRenameForStartedPlaylist,
          renameForStartedPlaylist,
      }}>
        <PlaylistMenu 
          darkTheme={darkTheme} 
          toggleDarkTheme={toggleDarkTheme} 
          sideMenuOpen={sideMenuOpen}
          toggleSideMenuOpen={toggleSideMenuOpen}
        />
      </MenuContext.Provider>
      <ViewerContext.Provider
        value={{
          setLoading,
          updateViewedPlaylist, 
          removeViewedPlaylist,
          artistsText,
          updateDeletedPlaylist,
          details,
          startNewPlaylist,
          currentSong,
          selectSong,
          updateDeletedSong,
          updateRearrangementCount
        }}
      >
        {viewerOpen ? 
          <PlaylistViewer darkTheme={darkTheme} details={details} sideMenuOpen={sideMenuOpen}/> :
          <HomeScreen darkTheme={darkTheme} sideMenuOpen={sideMenuOpen}/>
        }
      </ViewerContext.Provider>
      <MusicController 
        darkTheme={darkTheme}
        startedPlaylist={startedPlaylist}
        renameForStartedPlaylist={renameForStartedPlaylist}
        artistsText={artistsText}
        details={details}
        updateCurrentSong={updateCurrentSong}
        chosenSong={chosenSong}
        deletedSong={deletedSong}
        deletedPlaylist={deletedPlaylist}
        rearrangementCount={rearrangementCount}
      />
    </div>
  )
}

export default App
