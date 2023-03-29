import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import { createContext, useEffect, useState } from 'react'
import { AlertIcon } from './types'
import Alert from './components/Alert'
import { AnimatePresence } from 'framer-motion'
import { manageCart } from './utils/server'
import { resolveCid, saveQuantity } from './utils/client'

type globalContextType = {
	callAlert: (icon: AlertIcon, text: string) => void,
	updateCartCount: (count: number) => void,
	cartCount: number | undefined
}

const globalContextState = {callAlert: () => {}, updateCartCount: () => {}, cartCount: undefined}

export const globalContext = createContext<globalContextType>(globalContextState)

function App() {
	const [alert, setAlert] = useState(false)
	const [alertData, setAlertData] = useState<{ icon: AlertIcon, text: string } | undefined>()
	const [cartCount, setCartCount] = useState<number | undefined>()

	useEffect(() => {
		if (!cartCount) {
			const count = localStorage.getItem('cartQtty')

			if (count) {
				setCartCount(+JSON.parse(count))

				return
			}

			resolveCid()
			.then(cid => {
				manageCart(cid, true)
				.then(res => {
					saveQuantity(+res.count, setCartCount)
				})
			})
		}
	}, [])

	const callAlert = (icon: AlertIcon, text: string) => {
		setAlertData({icon, text})
		setAlert(true)
	}

	const updateCartCount = (count: number) => {
		setCartCount(count)
	}

	return (
		<globalContext.Provider value={{callAlert, updateCartCount, cartCount}}>
			<Header />
			<Outlet />
			<AnimatePresence mode='wait'>
				{alert && alertData && Object.keys(alertData).length && <Alert {...alertData} callback={setAlert} />}
			</AnimatePresence>
		</globalContext.Provider>
	)
}

export default App
