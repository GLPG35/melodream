test('Random test', () => {
	const isEeven = (num: number) => {
		return (num % 2) == 0
	}

	expect(isEeven(2)).toBe(true)
})