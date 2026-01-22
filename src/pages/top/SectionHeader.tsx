import { createMemo } from 'solid-js'

import { useI18n } from '~/i18n/Context'
import type { TextTranslationKey } from '~/i18n/types'
import { Link } from '~/navigation/Link'

import { ListPage } from '../list'

import * as styles from './SectionHeader.css'

export function SectionHeader(props: { readonly type: 'latest' | 'engaged' | 'hall_of_fame' }) {
	const { t, tt } = useI18n()

	const getLabel = createMemo(function() {
		return t('sections.' + props.type as TextTranslationKey)
	})

	return (
		<h2 class={styles.header}>
			<Link
				alternateLabel={tt('labels.open', getLabel())}
				class={styles.button}
				component={ListPage}
				params={props.type}
			>
				{getLabel()}
			</Link>
		</h2>
	)
}
