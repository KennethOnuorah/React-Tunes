function songReducer(state, action){
  switch (action.type) {
    case "set_current_playlist":
      return {
        ...state,
        currentPlaylist: action.playlist
      } 
    case "set_current_song":
      return {
        ...state,
        currentSong: action.song
      }
    case "update_current_time":
      return {
        ...state,
        currentTime: action.time
      }
    case "set_duration":
      return {
        ...state,
        duration: action.duration
      }
    case "reset_all":
      return {
        ...initialSongState,
      }
  }
  throw Error('Unknown action:', action.type) 
}

const initialSongState = {
  currentPlaylist: "",
  currentSong: "",
  currentTime: "0:00",
  duration: "0:00"
}

export {songReducer, initialSongState}