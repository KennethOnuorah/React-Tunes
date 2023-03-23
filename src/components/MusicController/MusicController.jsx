import { useRef, useReducer } from 'react'
import { useUpdateEffect } from 'react-use'
import * as localforage from 'localforage'

import LeftControls from './LeftControls/LeftControls'
import RightControls from './RightControls/RightControls'
import { songReducer, initialSongState } from '../../reducers/SongReducer'
import { controlsReducer, initialControlsState } from '../../reducers/ControlsReducer'

import getConvertedTime from '../../utils/getConvertedTime'
import useArrayMerge from '../../utils/useArrayMerge'
import useShuffle from '../../utils/useShuffle'

import "./MusicController.css"

const MusicController = (props) => {
  const [song, songDispatch] = useReducer(songReducer, initialSongState)
  const [controls, controlsDispatch] = useReducer(controlsReducer, initialControlsState)
  const onLastSong = controls.shuffleEnabled ? 
    controls.queues.shuffled.indexOf(song.currentSong) == controls.queues.shuffled.length - 1 :
    controls.queues.ordered.indexOf(song.currentSong) == controls.queues.ordered.length - 1
  const audioRef = useRef()
  const currentPlaylistCoverRef = useRef("../src/images/default_album_cover.png")
  const playbackBarRef = useRef()
  const volumeAdjusterRef = useRef()
  const volumeLevelBeforeMute = useRef(1)

  useUpdateEffect(() => {
    startNewQueue(props.startedPlaylist)
  }, [props.startedPlaylist])

  const startNewQueue = async(playlistName) => {
    if(playlistName == "") return
    console.log("STARTING PLAYLIST:", playlistName)
    songDispatch({type: "set_current_playlist", playlist: playlistName})
    const details = await localforage.getItem("_playlist_details")
    const ordered = useArrayMerge([details[playlistName]["allArtists"], details[playlistName]["allSongs"]], " - ")
    const shuffled = useShuffle([...ordered])
    const firstSong = !controls.shuffleEnabled ? ordered[0] : shuffled[0]
    controlsDispatch({type: "update_queues", queues: {ordered: [...ordered], shuffled: [...shuffled]}})
    songDispatch({type: "set_current_song", song: firstSong})
    controlsDispatch({type: "set_paused", isPaused: false})
    currentPlaylistCoverRef.current = details[playlistName]["coverArt"]
    audioRef.current.src = await localforage.getItem(`${playlistName}: ${firstSong}`)
    console.log("Now playing song:", firstSong)
    audioRef.current.play()
  }

  const handleQueueEnd = async() => {
    if(controls.currentPlayMode == "Loop playlist"){
      const reshuffled = useShuffle([...controls.queues.ordered])
      const firstSong = controls.shuffleEnabled ? reshuffled[0] : queues.ordered[0]
      controlsDispatch({type: "update_queues", queues: {...controls.queues, shuffled: [...reshuffled]}})
      songDispatch({type: "set_current_song", song: firstSong})
      audioRef.current.src = await localforage.getItem(`${song.currentPlaylist}: ${firstSong}`)
      audioRef.current.currentTime = 0
      console.log("Now playing song:", firstSong)
      audioRef.current.play()
    }else{
      audioRef.current.pause()
      controlsDispatch({type: "set_paused", isPaused: true})
    }
  }

  const onSongEnded = () => {
    if(controls.currentPlayMode == "Loop song"){
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }else{
      playNextSong()
    }
  }

  const playNextSong = async(playDirection="right") => {
    if(onLastSong){
      handleQueueEnd()
      return
    }
    const newSong = !controls.shuffleEnabled ? 
      controls.queues.ordered[playDirection.toLowerCase() == "right" ? 
        controls.queues.ordered.indexOf(song.currentSong) + 1 : controls.queues.ordered.indexOf(song.currentSong) - 1] :
      controls.queues.shuffled[playDirection.toLowerCase() == "right" ? 
        controls.queues.shuffled.indexOf(song.currentSong) + 1 : controls.queues.shuffled.indexOf(song.currentSong) - 1]
    songDispatch({type: "set_current_song", song: newSong})
    audioRef.current.src = await localforage.getItem(`${song.currentPlaylist}: ${newSong}`)
    console.log(`Now playing ${playDirection ? "next" : "previous"} song:`, newSong)
    controlsDispatch({type: "set_paused", isPaused: false})
    audioRef.current.play()
  }

  const skipCurrentSong = (skipDirection="right") => {
    switch (skipDirection.toLowerCase()) {
      case "right":
        console.log(`Skipping song: ${song.currentSong}`)
        playNextSong(skipDirection)
        break
      case "left":
        if(audioRef.current.currentTime > 3 
          || controls.queues.ordered.indexOf(song.currentSong) == 0
          || controls.queues.shuffled.indexOf(song.currentSong) == 0){
          audioRef.current.currentTime = 0
        }else{
          playNextSong(skipDirection)
        }
        break
      default:
        console.log(`"${skipDirection}" is not a valid skip direction.`)
        break
    }
  }

  return (
    <footer className={`musicController${props.darkTheme ? ' darkThemeMusicController' : ''}`}>
      <audio 
        ref={audioRef}
        onLoadedMetadata={(e) => songDispatch({
          type: "set_duration", duration: getConvertedTime(e.target.duration, true)
        })}
        onTimeUpdate={() => {
          playbackBarRef.current.value = !controls.playbackDragged ? 
            audioRef.current.currentTime : 
            playbackBarRef.current.value
          !controls.playbackDragged && songDispatch({
            type: "update_current_time", time: getConvertedTime(audioRef.current.currentTime, true)
          })
        }}
        onEnded={onSongEnded}
      />
      <div style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
        <img
          className='currentPlaylistCover'
          title={`${song.currentPlaylist !== "" ? song.currentPlaylist : "-"}`}
          src={currentPlaylistCoverRef.current} width={50} height={50}
        />
        <LeftControls
          darkTheme={props.darkTheme}
          reducer={{song, songDispatch, controls, controlsDispatch}}
          functions={{skipCurrentSong}}
          refs={{audioRef, playbackBarRef}}
        />
      </div>
      <RightControls
        darkTheme={props.darkTheme}
        reducer={{controls, controlsDispatch}}
        refs={{audioRef, volumeAdjusterRef, volumeLevelBeforeMute}}
      />
    </footer>
  )
}

export default MusicController