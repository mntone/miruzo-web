import { createResource, Match, Suspense, Switch, untrack } from 'solid-js'

import { DEFAULT_IMAGE_LIST_LIMIT } from '~/api/images'
import { ErrorMessage } from '~/components/ErrorMessage'
import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import type { ImageListType } from '~/domain'
import { useI18n } from '~/i18n/Context'
import { loadImageEntryList } from '~/repositories'

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

	const [resource] = createResource(options, loadImageEntryList)

	const { t } = useI18n()
	return (
		<>
			<Header />
			<HorizontalEdgeInsetBoundary
				minHorizontalEdgeInset={16}
				style={{
					'margin-bottom': '16px',
				}}
			>
				<Suspense fallback={t('labels.state_load')}>
					<Switch>
						<Match when={resource.error as unknown}>
							{function(getError) {
								return <ErrorMessage error={getError()} label={t('labels.state_error')} />
							}}
						</Match>

						<Match when={resource()}>
							{function(getInitial) {
								return (
									<MasonryImageList
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
