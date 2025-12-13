import { mapRecord, toDate, toDateOptional } from './utils'

describe('toDate', () => {
	it('converts ISO strings into Date objects', () => {
		const iso = '2024-03-01T12:34:56.000Z'
		expect(toDate(iso)).toEqual(new Date(iso))
	})
})

describe('toDateOptional', () => {
	it('returns undefined when the input is undefined', () => {
		expect(toDateOptional(undefined)).toBeUndefined()
	})

	it('delegates to toDate when a string is provided', () => {
		const iso = '2024-03-02T00:00:00.000Z'
		expect(toDateOptional(iso)).toEqual(new Date(iso))
	})
})

describe('mapRecord', () => {
	it('maps each value using the provided callback', () => {
		const src = { a: 1, b: 2 }
		const mapped = mapRecord(src, value => value * value)
		expect(mapped).toEqual({ a: 1, b: 4 })
	})

	it('creates a new object without mutating the source', () => {
		const src = { foo: 'x' }
		const mapped = mapRecord(src, value => value + value)

		expect(mapped).toEqual({ foo: 'xx' })
		expect(src).toEqual({ foo: 'x' })
		expect(mapped).not.toBe(src)
	})
})
