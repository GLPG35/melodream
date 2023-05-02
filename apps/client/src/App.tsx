import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AlertIcon, User } from './types'
import Alert from './components/Alert'
import { AnimatePresence } from 'framer-motion'
import { manageCart, manageUser } from './utils/server'
import { resolveCid, saveQuantity } from './utils/client'

type globalContextType = {
	callAlert: (icon: AlertIcon, text: string) => void,
	updateCartCount: (count?: number) => void,
	cartCount: number | undefined,
	user: User | undefined,
	setUser: Dispatch<SetStateAction<User | undefined>>
}

const globalContextState = {
	callAlert: () => {},
	updateCartCount: () => {},
	cartCount: undefined,
	user: undefined,
	setUser: () => {}
}

export const globalContext = createContext<globalContextType>(globalContextState)

function App() {
	const [alert, setAlert] = useState(false)
	const [alertData, setAlertData] = useState<{ icon: AlertIcon, text: string } | undefined>()
	const [cartCount, setCartCount] = useState<number | undefined>()
	const [user, setUser] = useState<User>()

	useEffect(() => {
		if (!user) {
			manageUser()
			.then(user => {
				setUser(user)

				resolveCid(user)
				.then(cid => {
					manageCart(cid, true)
					.then(res => {
						saveQuantity(+res.count, setCartCount)
					})
				})
			}).catch(() => {})
		}
	}, [])

	useEffect(() => {
		resolveCid(user)
		.then(cid => {
			manageCart(cid, true)
			.then(res => {
				saveQuantity(+res.count, setCartCount)
			})
		})
	}, [user])

	const callAlert = (icon: AlertIcon, text: string) => {
		setAlertData({icon, text})
		setAlert(true)
	}

	const updateCartCount = (count?: number) => {
		setCartCount(count)
	}

	return (
		<globalContext.Provider value={{callAlert, updateCartCount, cartCount, user, setUser}}>
			<Header />
			<Outlet />
			<AnimatePresence mode='wait'>
				{alert && alertData && Object.keys(alertData).length && <Alert {...alertData} callback={setAlert} />}
			</AnimatePresence>
		</globalContext.Provider>
	)
}

export default App
