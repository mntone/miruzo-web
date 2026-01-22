import { createResource, Suspense, Switch, Match, For } from 'solid-js'

import { ErrorMessage } from '~/components/ErrorMessage'
import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import { useSurfaceScope } from '~/hooks/useSurfaceScope'
import { useI18n } from '~/i18n/Context'

import { topPageConfigs } from './config'
import { loadTopPageData } from './data'
import { GridImageList } from './GridImageList'

export function TopPage() {
	useSurfaceScope(function() {
		return 'section'
	})

	const [resource] = createResource(topPageConfigs, loadTopPageData)

	const { t } = useI18n()
	return (
		<>
			<Header />
			<HorizontalEdgeInsetBoundary
				as='main'
				minHorizontalEdgeInset={16}
			>
				<Suspense fallback={t('labels.state_load')}>
					<Switch>
						<Match when={resource.error as unknown}>
							{function(getError) {
								return <ErrorMessage error={getError()} label={t('labels.state_error')} />
							}}
						</Match>

						<Match when={resource()}>
							{function(getInitials) {
								return (
									<For each={getInitials()}>
										{function(initial, getIndex) {
											return (
												<GridImageList
													config={topPageConfigs[getIndex()]}
													initial={initial}
												/>
											)
										}}
									</For>
								)
							}}
						</Match>
					</Switch>
				</Suspense>
			</HorizontalEdgeInsetBoundary>
		</>
	)
}
