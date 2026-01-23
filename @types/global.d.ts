declare module '*.css';
declare module '@fontsource/*' {}
declare module '@fontsource-variable/*' {}

declare global {
	interface Window {
		__miruzoFetchDelayEnabled?: boolean
		__miruzoOriginalFetch?: typeof fetch
	}
}

export {}
