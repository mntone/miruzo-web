import { isImageListType } from '~/domain'
import type { NavigationPageRouteId, NavigationRoute, NavigationRoutes } from '~/navigation/types'
import { DetailPage } from '~/pages/detail'

import { ListPage } from './ListPage'
import { TopPage } from './TopPage'

const imagePathPrefix = '/i/'

export const navigationRoutes = [
	{
		id: 'top',
		component: TopPage,
		toPath() {
			return '/'
		},
		fromPath(path) {
			return path === '/' ? true : undefined
		},
	} satisfies NavigationRoute<typeof TopPage>,
	{
		id: 'list',
		component: ListPage,
		fromPath(path) {
			if (path.startsWith(imagePathPrefix)) {
				const rawType = decodeURIComponent(path.slice(imagePathPrefix.length))
				if (rawType) {
					if (isImageListType(rawType)) {
						return rawType
					}
				}
			}
			return undefined
		},
		toPath(params) {
			return '/i/' + params
		},
	} satisfies NavigationRoute<typeof ListPage>,
	{
		id: 'detail',
		component: DetailPage,
		fromPath(path) {
			if (path.startsWith(imagePathPrefix)) {
				const rawType = decodeURIComponent(path.slice(imagePathPrefix.length))
				if (rawType) {
					const integer = Number(rawType)
					if (Number.isInteger(integer)) {
						return integer
					}
				}
			}
			return undefined
		},
		toPath(params) {
			return '/i/' + params.toString()
		},
	} satisfies NavigationRoute<typeof DetailPage>,
] as const satisfies NavigationRoutes

export const initialRouteId: NavigationPageRouteId<typeof navigationRoutes> = 'top'
