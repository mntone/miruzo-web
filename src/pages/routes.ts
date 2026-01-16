import type { NavigationPageRouteId, NavigationRoutes } from '~/navigation/types'
import { DetailPage } from '~/pages/detail'

import { ListPage } from './ListPage'
import { TopPage } from './TopPage'

export const navigationRoutes = [
	{
		id: 'top',
		type: 'page',
		component: TopPage,
	},
	{
		id: 'list',
		type: 'page',
		component: ListPage,
	},
	{
		id: 'detail',
		type: 'page',
		component: DetailPage,
	},
] as const satisfies NavigationRoutes

export const initialRouteId: NavigationPageRouteId<typeof navigationRoutes> = 'top'
