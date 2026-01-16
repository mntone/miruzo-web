import type { NavigationPageRouteId, NavigationRoutes } from '~/navigation/types'
import { DetailPage } from '~/pages/detail'

import { ListPage } from './ListPage'
import { TopPage } from './TopPage'

export const navigationRoutes = [
	{
		id: 'top',
		component: TopPage,
	},
	{
		id: 'list',
		component: ListPage,
	},
	{
		id: 'detail',
		component: DetailPage,
	},
] as const satisfies NavigationRoutes

export const initialRouteId: NavigationPageRouteId<typeof navigationRoutes> = 'top'
