let apiBaseUrl: string | undefined = undefined
function getApiBaseUrl(): string {
	if (apiBaseUrl !== undefined) {
		return apiBaseUrl
	}

	let base = import.meta.env.VITE_API_URL
	if (import.meta.env.DEV) {
		base = base.replace('{host}', window.location.hostname)
	}
	apiBaseUrl = base
	return base
}

export function apiClient<T>(method: string, path: string): Promise<T> {
	const init: RequestInit = {
		cache: 'no-store',
		credentials: 'omit',
		headers: {
			'user-agent': 'miruzo/' + import.meta.env.VITE_MIRUZOWEB_VERSION,
		},
		method,
		mode: import.meta.env.DEV ? 'cors' : 'same-origin',
		redirect: 'error',
		referrerPolicy: 'no-referrer',
	}

	return fetch(getApiBaseUrl() + path, init).then(function(response) {
		if (!response.ok) {
			throw new Error('Failed to fetch images: ' + response.status)
		}
		return response.json()
	})
}
