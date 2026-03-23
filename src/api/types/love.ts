import type { QuotaItem } from './quota'

export interface LoveStatsModel {
	readonly score: number
	readonly first_loved_at?: string
	readonly last_loved_at?: string
}

export interface LoveResponse {
	readonly quota: QuotaItem
	readonly stats: LoveStatsModel
}
