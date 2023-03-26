export function rearrangeMenuItems(lists, setStateActions, draggedRef, targetRef){
  for (const list of lists){
    const start = list.indexOf(draggedRef.current)
    const end = list.indexOf(targetRef.current)
    const draggedDown = end > start ? true : false
    if(draggedRef.current !== targetRef.current && targetRef.current !== ""){
      for (let i = start; draggedDown ? i < end : i > end; draggedDown ? i++ : i--) {
        const temp = list[i]
        const temp2 = list[draggedDown ? i+1 : i-1]
        list[draggedDown ? i+1 : i-1] = temp
        list[i] = temp2
      }
      setStateActions[lists.indexOf(list)]([...list])
    }
  }
}