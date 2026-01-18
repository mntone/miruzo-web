export type IngestId = number

export interface IngestIdListResponse {
	readonly ids: readonly IngestId[]
	readonly cursor?: string
}
