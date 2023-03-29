import { SiApplemusic as AppLogo } from 'react-icons/si'

import "./HomeScreen.css"

const HomeScreen = (props) => {
  return (
    <div 
      className='homeScreen'
      style={{
        left: props.sideMenuOpen ? "280px" : "51px"
      }}
    >
      <div 
        className='appLogo'
        style={{
          opacity: props.darkTheme ? "0.7" : "0.3",
          color: props.darkTheme ? "lightgray" : "black"
        }}
      >
        <AppLogo/>
        Tunes
      </div>
    </div>
  )
}

export default HomeScreen
