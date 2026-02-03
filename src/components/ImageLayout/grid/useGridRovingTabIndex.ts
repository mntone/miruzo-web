import { useRovingTabIndex } from '../shared/useRovingTabIndex'

interface GridRovingOptions {
	readonly initialIndex?: number

	getColumnCount(this: void): number
	getItemCount(this: void): number
}

export function useGridRovingTabIndex(options: GridRovingOptions) {
	return useRovingTabIndex({
		initialIndex: options.initialIndex,
		getItemCount: options.getItemCount,

		resolveNextIndex(event, index) {
			switch (event.key) {
			case 'ArrowRight': {
				const columnCount = options.getColumnCount()
				const rowEndIndex = index - (index % columnCount) + columnCount - 1
				const nextIndex = Math.min(rowEndIndex, index + 1)
				if (index !== nextIndex) {
					return nextIndex
				}
			}
				break
			case 'ArrowLeft': {
				const rowStartIndex = index - (index % options.getColumnCount())
				const nextIndex = Math.max(rowStartIndex, index - 1)
				if (index !== nextIndex) {
					return nextIndex
				}
			}
				break
			case 'ArrowDown': {
				const nextIndex = index + options.getColumnCount()
				if (nextIndex < options.getItemCount()) {
					return nextIndex
				}
			}
				break
			case 'ArrowUp': {
				const nextIndex = index - options.getColumnCount()
				if (nextIndex >= 0) {
					return nextIndex
				}
			}
				break
			case 'Home':
				if (index !== 0) {
					return 0
				}
				break
			case 'End': {
				const lastIndex = Math.max(0, options.getItemCount() - 1)
				if (index !== lastIndex) {
					return lastIndex
				}
			}
				break
			}
		},
	})
}
