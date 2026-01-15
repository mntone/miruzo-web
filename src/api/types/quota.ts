export interface QuotaItem {
	readonly period: 'daily'
	readonly reset_at: string
	readonly limit: number
	readonly remaining: number
}

export interface QuotaResponse {
	readonly love: QuotaItem
}
