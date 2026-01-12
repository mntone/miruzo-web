interface ImportMetaEnv {
	readonly VITE_API_URL: string
	readonly VITE_STATIC_ASSETS: string
	readonly VITE_USE_MOCK_EVENTS: 'true' | 'false'
	readonly VITE_MIRUZOWEB_VERSION: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
