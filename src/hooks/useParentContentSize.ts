import type { Accessor } from 'solid-js'

import type { Size } from './types'
import { useContentSize } from './useContentSize'

export function useParentContentSize(getElement: Accessor<HTMLElement | undefined>): Accessor<Size> {
	return useContentSize(function() {
		const parentElement = getElement()?.parentElement
		if (parentElement === null) {
			return undefined
		}
		return parentElement
	})
}
