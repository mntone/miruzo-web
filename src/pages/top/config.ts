export type TopPageImageListType = 'latest' | 'engaged' | 'hall_of_fame'

export interface TopPageSectionConfig {
	readonly aspectRatio: string
	readonly isHighPriority: boolean
	readonly listType: TopPageImageListType
	readonly maxRows: number
}
export type TopPageSectionConfigs = readonly TopPageSectionConfig[]

export const topPageConfigs: TopPageSectionConfigs = [
	{
		aspectRatio: '1.25',
		isHighPriority: true,
		listType: 'latest',
		maxRows: 2,
	},
	{
		aspectRatio: '.8',
		isHighPriority: false,
		listType: 'engaged',
		maxRows: 1,
	},
	{
		aspectRatio: '1',
		isHighPriority: false,
		listType: 'hall_of_fame',
		maxRows: 1,
	},
]
