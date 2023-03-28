function controlsReducer(state, action){
  const playModes = ["No looping", "Loop playlist", "Loop song"]
  switch (action.type) {
    case "set_paused":
      return {
        ...state, 
        paused: action.isPaused
      }
    case "update_queues":
      return {
        ...state,
        queues: {
          ordered: [...action.queues.ordered],
          shuffled: [...action.queues.shuffled]
        }
      }
    case "toggle_shuffle_mode":
      return {
        ...state,
        shuffleEnabled: !state.shuffleEnabled
      }
    case "change_play_mode":
      return {
        ...state, 
        currentPlayMode: playModes.indexOf(state.currentPlayMode) == playModes.length - 1 ? 
          "No looping" : playModes[playModes.indexOf(state.currentPlayMode) + 1]
      }
    case "drag_playback":
      return {
        ...state,
        playbackDragged: action.isPlaybackDragged
      }
    case "set_volume":
      return {
        ...state,
        volume: action.volume
      }
    case "reset_all":
      return {
        ...initialControlsState
      }
  }
  throw Error('Unknown action:', action.type);
}

const initialControlsState = {
  paused: true,
  queues: { ordered: [], shuffled: [] },
  shuffleEnabled: false,
  currentPlayMode: "No looping",
  playbackDragged: false,
  volume: 1
}

export {controlsReducer, initialControlsState}