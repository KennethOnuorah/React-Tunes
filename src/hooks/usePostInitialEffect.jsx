import { useEffect, useRef } from 'react'
/**
 * Custom hook that fires a side effect based on its specified dependencies, but only after the initial render
*/
const usePostInitialEffect = (func, deps) => {
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
    else {
      func()
    }
  }, deps)
}
export default usePostInitialEffect