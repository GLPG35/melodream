import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { IconContext } from 'react-icons'
import './global.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IconContext.Provider value={{ size: '1.4em', style: { verticalAlign: 'middle' } }}>
      <App />
    </IconContext.Provider>
  </React.StrictMode>
)
