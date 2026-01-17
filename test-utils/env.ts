import { resetBaseUrlForTests } from '~/repositories/variants'

import type { MutableEnv } from './types'

export function setupEnvStub(
	host: string = '{host}',
	protocol: string = '{protocol}',
): MutableEnv {
	const env = import.meta.env as MutableEnv
	const originalEnv = {
		DEV: env.DEV,
		VITE_STATIC_ASSET_HOST: env.VITE_STATIC_ASSET_HOST,
		VITE_STATIC_ASSET_PROTOCOL: env.VITE_STATIC_ASSET_PROTOCOL,
	}

	beforeEach(function() {
		env.DEV = true
		env.VITE_STATIC_ASSET_HOST = host
		env.VITE_STATIC_ASSET_PROTOCOL = protocol
		vi.stubGlobal('window', {
			location: {
				hostname: 'images.local',
				protocol: 'https:',
			},
		} as Pick<Window, 'location'>)

		resetBaseUrlForTests()
	})

	afterEach(function() {
		env.DEV = originalEnv.DEV
		env.VITE_STATIC_ASSET_HOST = originalEnv.VITE_STATIC_ASSET_HOST
		env.VITE_STATIC_ASSET_PROTOCOL = originalEnv.VITE_STATIC_ASSET_PROTOCOL
		vi.unstubAllGlobals()
	})

	return env
}
