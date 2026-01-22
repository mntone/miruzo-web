import { createResource, Suspense, Switch, Match, For, createSignal, Show } from 'solid-js'

import { ErrorMessage } from '~/components/ErrorMessage'
import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import { useLayoutMetrics } from '~/components/ImageLayout'
import { useContentSize } from '~/hooks'
import { useSurfaceScope } from '~/hooks/useSurfaceScope'
import { useI18n } from '~/i18n/Context'

import { topPageConfigs } from './config'
import { loadTopPageData } from './data'
import { GridImageList } from './GridImageList'
import { topPageIntervals } from './interval'

export function TopPage() {
	useSurfaceScope(function() {
		return 'section'
	})

	const [getElement, setElement] = createSignal<HTMLElement | undefined>(undefined)
	const getLayoutSize = useContentSize(getElement)
	const getMetrics = useLayoutMetrics(function() {
		return getLayoutSize()[0]
	}, {
		intervals: topPageIntervals,
	})

	const [resource] = createResource(topPageConfigs, loadTopPageData)

	const { t } = useI18n()
	return (
		<>
			<Header />
			<HorizontalEdgeInsetBoundary
				ref={setElement}
				as='main'
				minHorizontalEdgeInset={16}
			>
				<Suspense fallback={t('labels.state_load')}>
					<Switch fallback={t('labels.state_none')}>
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
												<Show when={initial}>
													{function(getEntries) {
														return (
															<GridImageList
																config={topPageConfigs[getIndex()]}
																getMetrics={getMetrics}
																initial={getEntries()}
															/>
														)
													}}
												</Show>
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
