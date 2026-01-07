export type MutableEnv = {
	-readonly [K in keyof ImportMetaEnv]: ImportMetaEnv[K]
} & {
	DEV: boolean
	VITE_STATIC_ASSETS: string
}
