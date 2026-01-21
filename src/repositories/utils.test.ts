import { deleteOwnProperty } from './utils'

describe('deleteOwnProperty', () => {
	it('removes own properties when present', () => {
		const obj: Record<string, unknown> = { value: 1 }
		deleteOwnProperty(obj, 'value')

		expect(Object.hasOwn(obj, 'value')).toBe(false)
	})

	it('ignores inherited properties', () => {
		const obj: Record<string, unknown> = {}
		Object.setPrototypeOf(obj, { inherited: 1 })
		deleteOwnProperty(obj, 'inherited')

		expect(Object.hasOwn(obj, 'inherited')).toBe(false)
		expect(obj['inherited']).toBe(1)
	})
})
