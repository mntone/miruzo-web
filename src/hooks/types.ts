import type { ImageListType } from '~/domain'

export type Size = readonly [width: number, height: number]

export interface IngestIdListParams {
	readonly type: ImageListType
	readonly limit?: number
}
