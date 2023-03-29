import * as localforage from 'localforage'
import useArrayMerge from '../../general/ArrayMerge'
import * as id3 from "id3js"

async function uploadAudio(fileList, details, playlistUpdateMethod, setLoading){
  setLoading(true)
  const playlistDetails = await localforage.getItem("_playlist_details")
  for(const file of fileList) {
    const tags = await id3.fromFile(file)
    const originalSongList = useArrayMerge([
      playlistDetails[details.name]["allArtists"],
      playlistDetails[details.name]["allSongs"]
    ], 
      " - "
    )
    if(!originalSongList.includes(`${tags.artist} - ${tags.title}`)){
      let reader = new FileReader()
      reader.onloadend = async() => {
        let audio = new Audio(reader.result)
        audio.onloadedmetadata = async() => {
          playlistDetails[details.name]["totalLength"] += Math.floor(audio.duration)
          playlistDetails[details.name]["allSongDurations"].push(Math.floor(audio.duration))
          await localforage.setItem(`_playlist_details`, playlistDetails)
        }
        await localforage.setItem(`${details.name}: ${tags.artist} - ${tags.title}`, reader.result)
        playlistUpdateMethod({
          artists: playlistDetails[details.name]["allArtists"],
          songCount: [...playlistDetails[details.name]["allSongs"]].length,
          length: playlistDetails[details.name]["totalLength"]
        }, details.name)
      }
      reader.readAsDataURL(file)
      console.log(`Uploading song: ${tags.artist} - ${tags.title}`)
      playlistDetails[details.name]["allArtists"].push(tags.artist)
      playlistDetails[details.name]["allSongs"].push(tags.title)
    }else{
      alert(`"${tags.artist} - ${tags.title}" is already in this playlist.`)
    }
  }
  await localforage.setItem(`_playlist_details`, playlistDetails)
  setLoading(false)
  console.log(`Updated playlist details (${new Date().toLocaleTimeString()})\n`, playlistDetails)
}

async function uploadImage(file, details, playlistUpdateMethod){
  var reader = new FileReader()
  reader.onloadend = async() => {
    const playlistDetails = await localforage.getItem("_playlist_details")
    playlistDetails[details.name]["coverArt"] = reader.result
    await localforage.setItem("_playlist_details", playlistDetails)
    playlistUpdateMethod({ artSrc: reader.result }, details.name)
  }
  reader.readAsDataURL(file)
}

export {uploadAudio, uploadImage}