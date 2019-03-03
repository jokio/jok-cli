import capitalizeFirstLetter from './capitalizeFirstLetter'

describe('capitalizeFirstLetter', () => {
	it('should uppercase first letter', () => {

		expect(capitalizeFirstLetter('hello'))
			.toEqual('Hello')

		expect(capitalizeFirstLetter('Hello'))
			.toEqual('Hello')
	})
})
