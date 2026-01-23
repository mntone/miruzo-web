import { createResource, createSignal, Match, Suspense, Switch, untrack } from 'solid-js'

import { DEFAULT_IMAGE_LIST_LIMIT } from '~/api/images'
import { ErrorMessage } from '~/components/ErrorMessage'
import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import { useLayoutMetrics } from '~/components/ImageLayout'
import { LoadingView } from '~/components/progress'
import type { ImageListType } from '~/domain'
import { useContentWidth } from '~/hooks'
import { useI18n } from '~/i18n/Context'
import { loadImageEntryList } from '~/repositories'

import { listPageIntervals } from './interval'
import { MasonryImageList } from './MasonryImageList'

interface ListPageProps {
	readonly params: ImageListType
}

export function ListPage(props: ListPageProps) {
	const options = untrack(function() {
		return {
			type: props.params,
			limit: DEFAULT_IMAGE_LIST_LIMIT,
		}
	})

	const [getElement, setElement] = createSignal<HTMLElement | undefined>(undefined)
	const getLayoutWidth = useContentWidth(getElement)
	const getMetrics = useLayoutMetrics(getLayoutWidth, {
		intervals: listPageIntervals,
	})

	const [resource] = createResource(options, loadImageEntryList)

	const { t } = useI18n()
	return (
		<>
			<Header />
			<HorizontalEdgeInsetBoundary
				ref={setElement}
				aria-busy={resource.loading}
				minHorizontalEdgeInset={16}
				style={{
					'margin-bottom': '16px',
				}}
			>
				<Suspense fallback={<LoadingView height='calc(100svh - 64px)' />}>
					<Switch fallback={t('labels.state_none')}>
						<Match when={resource.error as unknown}>
							{function(getError) {
								return <ErrorMessage error={getError()} label={t('labels.state_error')} />
							}}
						</Match>

						<Match when={resource()}>
							{function(getInitial) {
								return (
									<MasonryImageList
										getMetrics={getMetrics}
										initial={getInitial()}
										options={options}
									/>
								)
							}}
						</Match>
					</Switch>
				</Suspense>
			</HorizontalEdgeInsetBoundary>
		</>
	)
}
