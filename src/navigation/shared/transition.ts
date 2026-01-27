import type { NavigationTransitionInfo } from '../types'

export function shouldPlayEntranceAnimation(info: NavigationTransitionInfo): boolean {
	return info.action !== 'pop'
}
