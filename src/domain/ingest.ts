/**
 * IngestId values are JavaScript-safe integers (<= 2^53 - 1).
 *
 * The database uses BIGINT, but the frontend assumes a safe range.
 */
export type IngestId = number

export interface IngestIdListResponse {
	readonly ids: readonly IngestId[]
	readonly cursor?: string
}
