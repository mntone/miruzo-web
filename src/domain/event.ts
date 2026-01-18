import { Result } from './result'
import type { StatsEntry } from './stats'

export type EventType =
	| 'love'
	| 'love:first'
	| 'post:memo'
	| 'view:milestone'

interface LoveEventEntry {
	readonly type: 'love'
	readonly occurredAt: Date
}

interface FirstLoveEventEntry {
	readonly type: 'love:first'
	readonly occurredAt: Date
}

interface MemoEventEntry {
	readonly type: 'post:memo'
	readonly occurredAt: Date
	readonly message: string
}

interface MilestoneViewEventEntry {
	readonly type: 'view:milestone'
	readonly occurredAt: Date
	readonly viewCount: number
}

export type EventEntry =
	| LoveEventEntry
	| FirstLoveEventEntry
	| MemoEventEntry
	| MilestoneViewEventEntry

export type EventEntries = readonly EventEntry[]

export type EventValidationErrorReason =
	| 'love-mismatch'
	| 'milestone-mismatch'

export function validateEventStats(stats: StatsEntry): EventValidationErrorReason | undefined {
	const hasFirstLove = stats.firstLovedAt !== undefined
	const hasLastLove = stats.lastLovedAt !== undefined
	if (hasFirstLove !== hasLastLove) {
		return 'love-mismatch'
	}

	const hasMilestoneCount = stats.viewMilestoneCount !== undefined
	const hasMilestoneArchived = stats.viewMilestoneArchivedAt !== undefined
	if (hasMilestoneCount !== hasMilestoneArchived) {
		return 'milestone-mismatch'
	}

	return undefined
}

export function deriveEventsFromStats(stats: StatsEntry): EventEntries {
	const entries: EventEntry[] = []

	const firstLovedAt = stats.firstLovedAt
	const lastLovedAt = stats.lastLovedAt
	if (lastLovedAt !== undefined) {
		const sameLoveTimestamp = firstLovedAt?.getTime() === lastLovedAt.getTime()
		if (!sameLoveTimestamp) {
			entries.push({
				type: 'love',
				occurredAt: lastLovedAt,
			})
		}
	}

	if (firstLovedAt !== undefined) {
		entries.push({
			type: 'love:first',
			occurredAt: firstLovedAt,
		})
	}

	if (stats.viewMilestoneCount !== undefined && stats.viewMilestoneArchivedAt !== undefined) {
		entries.push({
			type: 'view:milestone',
			occurredAt: stats.viewMilestoneArchivedAt,
			viewCount: stats.viewMilestoneCount,
		})
	}

	entries.sort(function(a, b) {
		return b.occurredAt.getTime() - a.occurredAt.getTime()
	})

	return entries
}

export function tryDeriveEventsFromStats(
	stats: StatsEntry,
): Result<EventEntries, EventValidationErrorReason> {
	const reason = validateEventStats(stats)
	if (reason !== undefined) {
		return Result.failure(reason)
	}

	const entry = deriveEventsFromStats(stats)
	return Result.success(entry)
}
