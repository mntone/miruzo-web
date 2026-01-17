function updateScrollbarWidth() {
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
	document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
}

export function disableBodyScroll() {
	updateScrollbarWidth()
	document.documentElement.classList.add('scroll-lock')
}

export function enableBodyScroll() {
	document.documentElement.classList.remove('scroll-lock')
}
