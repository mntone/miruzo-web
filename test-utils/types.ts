export type MutableEnv = {
	-readonly [K in keyof ImportMetaEnv]: ImportMetaEnv[K]
} & {
	DEV: boolean
	VITE_STATIC_ASSET_HOST: string
	VITE_STATIC_ASSET_PROTOCOL: string
}
