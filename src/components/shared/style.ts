export function px(length: number | undefined): string | undefined {
	return length !== undefined ? `${length}px` : undefined
}

export function pxNonZero(length: number): string | undefined {
	return length !== 0 ? `${length}px` : undefined
}

export function zeroVerticalHorizontalPx(length: number | undefined): string | undefined {
	return length !== undefined ? `0 ${length}px` : undefined
}

export function zeroVerticalHorizontalPxNonZero(length: number): string | undefined {
	return length !== 0 ? `0 ${length}px` : undefined
}
