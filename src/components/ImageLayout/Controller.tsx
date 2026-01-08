import { Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { DEFAULT_IMAGE_LIST_LIMIT } from '~/api/constants'
import { useIngestIdList } from '~/hooks/useIngestIdList'
import { useI18n } from '~/i18n/Context'
import { getExcludeFormats } from '~/utils/imageSupport'

import * as styles from './Controller.css'
import type { ImageLayoutControllerProps, ImageLayoutProps } from './types'

export function ImageLayoutController(props: ImageLayoutControllerProps) {
	const { t } = useI18n()
	/* eslint-disable solid/reactivity */
	const [getImageIds, listPage, loadMore] = useIngestIdList(
		props.listType,
		props.limit || DEFAULT_IMAGE_LIST_LIMIT,
		getExcludeFormats(),
	)
	/* eslint-enable solid/reactivity */

	function hasNext() {
		const p = listPage()
		return p ? Boolean(p.cursor) : false
	}

	const nextProps: ImageLayoutProps = {
		as: 'main',
		header: (
			<>
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
		footer: (
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

				<Show when={!hasNext() && getImageIds().length > 0}>
					<div class='image-page__status'>
						No more images
					</div>
				</Show>
			</footer>
		),

		getImageIds,
	}
	return <Dynamic component={props.layout} {...nextProps} />
}
