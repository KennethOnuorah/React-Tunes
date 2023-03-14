/**
 * Takes two or more arrays and merges them together into one array, including their corresponding elements.
*/
export default function useArrayMerge(arrays=[], separator=""){
  let newList = arrays[0].map((l) => "")
    for(const array of arrays){
        for(let i = 0; i < array.length; i++){
            newList[i] = arrays.indexOf(array) !== 0 ? newList[i] + separator : ""
            newList[i] += array[i]
        }
    }
    return newList
}