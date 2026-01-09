import { Show, type Component } from 'solid-js'

import type { Writable } from '~/@types/utils'
import { DEFAULT_IMAGE_LIST_LIMIT } from '~/api/constants'
import type { IngestId } from '~/domain'
import { useIngestIdList } from '~/hooks/useIngestIdList'
import { useI18n } from '~/i18n/Context'
import { imageStore } from '~/stores/images'
import { getExcludeFormats } from '~/utils/imageSupport'

import * as styles from './Controller.css'
import type { LayoutProps, LayoutPropsBase } from './shared/types'
import type { ImageLayoutControllerProps } from './types'

export function ImageLayoutController<Layout extends Component<LayoutProps<IngestId>>>(props: ImageLayoutControllerProps<Layout>) {
	const { t } = useI18n()
	/* eslint-disable solid/reactivity */
	const [getIngestIds, listPage, loadMore] = useIngestIdList(
		props.listType,
		props.limit || DEFAULT_IMAGE_LIST_LIMIT,
		getExcludeFormats(),
	)
	/* eslint-enable solid/reactivity */

	function hasNext() {
		const p = listPage()
		return p ? Boolean(p.cursor) : false
	}

	const nextProps: Writable<LayoutPropsBase<IngestId>> = {
		// eslint-disable-next-line solid/reactivity
		as: props.as || 'div',
		header: (
			<>
				<Show when={props.header}>
					{props.header}
				</Show>

				<Show when={listPage.loading}>
					<div class='image-page_status'>
						{t('shared.loading')}
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
		children(accessors, ingestId: IngestId) {
			return (
				<Show when={imageStore.imagesById[ingestId]}>
					{props.children.bind(null, accessors)}
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
						{t(listPage.loading ? 'shared.loading' : 'image_list.more')}
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
