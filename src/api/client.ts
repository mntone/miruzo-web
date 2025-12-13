let API_BASE_URL = import.meta.env.VITE_API_URL
if (import.meta.env.DEV) {
	API_BASE_URL = API_BASE_URL.replace('{host}', window.location.hostname)
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

	return fetch(API_BASE_URL + path, init).then(function(response) {
		if (!response.ok) {
			throw new Error('Failed to fetch images: ' + response.status)
		}
		return response.json()
	})
}
