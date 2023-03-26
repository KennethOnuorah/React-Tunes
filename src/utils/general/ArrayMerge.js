export default function useArrayMerge(arrays=[], separator=""){
  let newList = Array(arrays[0].length).fill("")
    for(const array of arrays){
        for(let i = 0; i < array.length; i++){
            newList[i] = arrays.indexOf(array) !== 0 ? newList[i] + separator : ""
            newList[i] += array[i]
        }
    }
    return newList
}