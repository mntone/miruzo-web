import { deleteOwnProperty, hasOwn } from './utils'

describe('hasOwn', () => {
	it('returns true only for own properties', () => {
		const obj: Record<string, unknown> = { own: 2 }
		Object.setPrototypeOf(obj, { inherited: 1 })

		expect(hasOwn(obj, 'own')).toBe(true)
		expect(hasOwn(obj, 'inherited')).toBe(false)
	})
})

describe('deleteOwnProperty', () => {
	it('removes own properties when present', () => {
		const obj: Record<string, unknown> = { value: 1 }
		deleteOwnProperty(obj, 'value')

		expect(hasOwn(obj, 'value')).toBe(false)
	})

	it('ignores inherited properties', () => {
		const obj: Record<string, unknown> = {}
		Object.setPrototypeOf(obj, { inherited: 1 })
		deleteOwnProperty(obj, 'inherited')

		expect(hasOwn(obj, 'inherited')).toBe(false)
		expect(obj['inherited']).toBe(1)
	})
})
