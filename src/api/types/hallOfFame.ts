export interface HallOfFameStatsModel {
	readonly hall_of_fame_at?: string
}

export interface HallOfFameResponse {
	readonly stats: HallOfFameStatsModel
}
