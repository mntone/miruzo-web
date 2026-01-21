import { Show, type Component } from 'solid-js'

import type { Writable } from '~/@types/utils'
import type { ImageEntry } from '~/domain'
import { useImageEntries } from '~/hooks/useImageEntries'
import { useI18n } from '~/i18n/Context'
import { getExcludeFormats } from '~/utils/imageSupport'

import * as styles from './Controller.css'
import type { LayoutProps, LayoutPropsBase } from './shared/types'
import type { ImageLayoutControllerProps } from './types'

export function ImageLayoutController<Layout extends Component<LayoutProps<ImageEntry>>>(props: ImageLayoutControllerProps<Layout>) {
	const { t } = useI18n()
	/* eslint-disable solid/reactivity */
	const [getImageEntries, listPage, loadMore] = useImageEntries(
		props.requestParams,
		getExcludeFormats(),
	)
	/* eslint-enable solid/reactivity */

	function hasNext() {
		const p = listPage()
		return p ? Boolean(p.cursor) : false
	}

	const nextProps: Writable<LayoutPropsBase<ImageEntry>> = {
		header: (
			<>
				<Show when={props.header}>
					{props.header}
				</Show>

				<Show when={listPage.loading}>
					<div class='image-page_status'>
						{t('labels.state_load')}
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
		// eslint-disable-next-line solid/reactivity
		itemComponent: props.itemComponent,
		getItems: getImageEntries,
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
						{t(listPage.loading ? 'labels.state_load' : 'actions.more')}
					</button>
				</Show>

				<Show when={!hasNext() && getImageEntries().length > 0}>
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
