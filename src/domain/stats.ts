export const HALL_OF_FAME_SCORE_THRESHOLD: number = 180

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

export function canGrantHallOfFame(stats: StatsEntry): boolean {
	return stats.hallOfFameAt === undefined && stats.score >= HALL_OF_FAME_SCORE_THRESHOLD
}
