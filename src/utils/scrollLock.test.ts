import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { disableBodyScroll, enableBodyScroll } from './scrollLock'

const createDocumentStub = () => {
	const styleMap = new Map<string, string>()
	return {
		documentElement: {
			clientWidth: 980,
			classList: {
				add: vi.fn(),
				remove: vi.fn(),
				contains: vi.fn(),
			},
			style: {
				setProperty: vi.fn((property: string, value: string) => {
					styleMap.set(property, value)
				}),
			},
		},
		getStyleMap: () => styleMap,
	} satisfies {
		documentElement: {
			clientWidth: number
			classList: Pick<DOMTokenList, 'add' | 'remove' | 'contains'>
			style: Pick<CSSStyleDeclaration, 'setProperty'>
		}
		getStyleMap: () => Map<string, string>
	}
}

let documentStub: ReturnType<typeof createDocumentStub>

beforeEach(() => {
	documentStub = createDocumentStub()
	vi.stubGlobal('document', documentStub)
	vi.stubGlobal('window', { innerWidth: 1000 } as Pick<Window, 'innerWidth'>)
})

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('scroll lock helpers', () => {
	it('adds the scroll-lock class and stores the scrollbar width', () => {
		disableBodyScroll()

		expect(documentStub.documentElement.classList.add).toHaveBeenCalledWith('scroll-lock')
		expect(documentStub.getStyleMap().get('--scrollbar-width')).toBe('20px')
	})

	it('removes the scroll-lock class', () => {
		enableBodyScroll()

		expect(documentStub.documentElement.classList.remove).toHaveBeenCalledWith('scroll-lock')
	})
})
