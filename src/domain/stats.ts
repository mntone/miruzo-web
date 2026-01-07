export interface StatsEntry {
	readonly score: number
	readonly viewCount: number
	readonly lastViewedAt?: Date
	readonly firstLovedAt?: Date
	readonly lastLovedAt?: Date
	readonly hallOfFameAt?: Date
	readonly viewMilestoneCount?: number
	readonly viewMilestoneArchivedAt?: Date
}
