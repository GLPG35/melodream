import { ChangeEvent, useState } from 'react'

const useCheckInput = (): [
	{ id: string, state: boolean }[],
	(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
] => {
	const [inputs, setInputs] = useState<{id: string, state: boolean}[]>([])

	const checkEmptyInput = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
		const inputsCopy = inputs

		const inputState = e.target.tagName == 'INPUT' ? e.target.value !== '' :
			e.target.tagName == 'SELECT' ? e.target.value !== 'default' :
			e.target.tagName == 'TEXTAREA' && e.target.value !== ''
		const findInput = inputsCopy.find(x => x.id == e.target.id)

		if (findInput) {
			const filteredInputs = inputsCopy.filter(x => x.id != e.target.id)

			setInputs([])
			setInputs(filteredInputs)
		}

		setInputs(prev => [...prev, { id: e.target.id, state: inputState }])
	}
	
	return [inputs, checkEmptyInput]
}

export default useCheckInput