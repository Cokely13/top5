import React from 'react'

import Navbar from './components/Navbar'
import Routes from './Routes'

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="content-container">
        <Routes />
      </div>
    </div>
  )
}

export default App
