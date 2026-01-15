export interface QuotaEntry {
	readonly resetAt: Date | null
	readonly limit: number
	readonly remaining: number
	readonly used: number
}

export interface QuotaEntries {
	love: QuotaEntry
}
