import type { ImageStatus } from '~/domain/images/shared'

export function mapImageStatus(r: number | undefined): ImageStatus {
	if (r === undefined) {
		return 'active'
	}

	switch (r) {
	case 0:
		return 'active'
	case 1:
		return 'deleted'
	case 2:
		return 'missing'
	default:
		return 'unknown'
	}
}
