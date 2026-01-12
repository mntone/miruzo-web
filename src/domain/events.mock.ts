import type { EventEntries } from './events'

export const mockEvents: EventEntries = [
	{
		type: 'love',
		occurredAt: new Date(Date.UTC(2026, 0, 9, 9, 0, 0)),
	},
	{
		type: 'post:memo',
		occurredAt: new Date(Date.UTC(2026, 0, 8, 9, 30, 0)),
		message: 'This is the sample message.',
	},
	{
		type: 'view:milestone',
		occurredAt: new Date(Date.UTC(2026, 0, 8, 9, 0, 0)),
		viewCount: 1000,
	},
	{
		type: 'love:first',
		occurredAt: new Date(Date.UTC(2026, 0, 6, 9, 0, 0)),
	},
]
