import "./LoadingScreen.css"

const LoadingScreen = ({isLoading}) => {
  return (
    <div 
      className="loadingScreen"
      style={{
        display: isLoading ? "flex" : "none"
      }}
    >
      <img src="/images/loading.gif" width={50}/>
    </div>
  )
}

export default LoadingScreen
