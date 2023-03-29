export default function getConvertedTime(seconds=0, digitalFormat=false){
  seconds = parseInt(seconds)
  let sec = 0
  let min = 0
  let hr = 0
  while(seconds > 0){
    if(0 <= seconds && seconds <= 59){
      sec = seconds
      seconds = 0
    }else if(60 <= seconds && seconds <= 3599){
      min = Math.floor(seconds / 60)
      seconds %= 60
    }else if(seconds >= 3600){
      hr = Math.floor(seconds / 3600)
      seconds %= 3600
    }
  }
  if(!digitalFormat){
    return `${hr > 0 ? hr + " hr," : ""} ${min > 0 ? min + " min," : ""} ${sec} sec`
  }else{
    const secText = sec.toString().padStart(2, "0")
    const minText = hr > 0 ? min.toString().padStart(2, "0") : min.toString()
    const hrText = hr > 0 ? hr.toString().padStart(2, "0") + ":" : ""
    return `${hrText}${minText}:${secText}`
  }
}