import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import { createContext, useState } from 'react'
import { AlertIcon } from './types'
import Alert from './components/Alert'
import { AnimatePresence } from 'framer-motion'

type globalContextType = {
  callAlert: (icon: AlertIcon, text: string) => void
}

const globalContextState = {callAlert: () => {}}

export const globalContext = createContext<globalContextType>(globalContextState)

function App() {
  const [alert, setAlert] = useState(false)
  const [alertData, setAlertData] = useState<{ icon: AlertIcon, text: string } | undefined>()

  const callAlert = (icon: AlertIcon, text: string) => {
    setAlertData({icon, text})
    setAlert(true)
  }

  return (
    <globalContext.Provider value={{callAlert}}>
      <Header />
      <Outlet />
      <AnimatePresence mode='wait'>
        {alert && alertData && Object.keys(alertData).length && <Alert {...alertData} callback={setAlert} />}
      </AnimatePresence>
    </globalContext.Provider>
  )
}

export default App
