import type { ImageListType } from '~/domain'

export interface IngestIdListParams {
	readonly type: ImageListType
	readonly limit?: number
}
