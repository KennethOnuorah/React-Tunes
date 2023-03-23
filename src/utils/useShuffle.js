export default function useShuffle(array){
  array = array.map(value => ({ value, sort: realRandom() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    return array
}

function realRandom(){
  return Math.pow(10, 14) * Math.random() * Math.random()
}