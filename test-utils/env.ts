import type { MutableEnv } from './types'

export function setupEnvStub(): MutableEnv {
	const env = import.meta.env as MutableEnv
	const originalEnv = {
		DEV: env.DEV,
		VITE_STATIC_ASSETS: env.VITE_STATIC_ASSETS,
	}

	beforeEach(function() {
		env.DEV = true
		env.VITE_STATIC_ASSETS = 'https://{host}'
		vi.stubGlobal('window', {
			location: { hostname: 'images.local' },
		} as Pick<Window, 'location'>)
	})

	afterEach(function() {
		env.DEV = originalEnv.DEV
		env.VITE_STATIC_ASSETS = originalEnv.VITE_STATIC_ASSETS
		vi.unstubAllGlobals()
	})

	return env
}
