import type { Accessor } from 'solid-js'

import { useContentSize } from './useContentSize'

export function useParentContentSize(getElement: Accessor<HTMLElement | undefined>) {
	return useContentSize(function() {
		const parentElement = getElement()?.parentElement
		if (parentElement === null) {
			return undefined
		}
		return parentElement
	})
}
