import { Show, type Component } from 'solid-js'

import type { Writable } from '~/@types/utils'
import type { IngestId } from '~/domain'
import { useIngestIdList } from '~/hooks/useIngestIdList'
import { useI18n } from '~/i18n/Context'
import { imageStore } from '~/stores/image'
import { getExcludeFormats } from '~/utils/imageSupport'

import * as styles from './Controller.css'
import type { LayoutProps, LayoutPropsBase } from './shared/types'
import type { ImageLayoutControllerProps } from './types'

export function ImageLayoutController<Layout extends Component<LayoutProps<IngestId>>>(props: ImageLayoutControllerProps<Layout>) {
	const { t } = useI18n()
	/* eslint-disable solid/reactivity */
	const [getIngestIds, listPage, loadMore] = useIngestIdList(
		props.requestParams,
		getExcludeFormats(),
	)
	/* eslint-enable solid/reactivity */

	function hasNext() {
		const p = listPage()
		return p ? Boolean(p.cursor) : false
	}

	const nextProps: Writable<LayoutPropsBase<IngestId>> = {
		header: (
			<>
				<Show when={props.header}>
					{props.header}
				</Show>

				<Show when={listPage.loading}>
					<div class='image-page_status'>
						{t('labels.loading')}
					</div>
				</Show>

				{/* TODO: remove unknown */}
				<Show when={listPage.error as unknown}>
					<div class='image-page__error'>
						Failed to load:
						{listPage.error}
					</div>
				</Show>
			</>
		),
		itemComponent(templateProps) {
			return (
				<Show when={imageStore.imagesById[templateProps.item]}>
					{function(getImageEntry) {
						const Component = props.itemComponent
						return (
							<Component
								{...templateProps}
								item={getImageEntry()}
							/>
						)
					}}
				</Show>
			)
		},
		getItems: getIngestIds,
	}

	// eslint-disable-next-line solid/reactivity
	if (props.useMoreButton) {
		nextProps.footer = (
			<footer class={styles.footer}>
				<Show when={hasNext()}>
					<button
						class={styles.more}
						disabled={listPage.loading}
						type='button'
						onClick={loadMore}
					>
						{t(listPage.loading ? 'labels.loading' : 'actions.more')}
					</button>
				</Show>

				<Show when={!hasNext() && getIngestIds().length > 0}>
					<div class='image-page__status'>
						No more images
					</div>
				</Show>
			</footer>
		)
	}

	// eslint-disable-next-line solid/reactivity
	const LayoutComponent = props.layout
	return (
		<LayoutComponent
			{...props.layoutProps}
			{...nextProps}
		/>
	)
}
