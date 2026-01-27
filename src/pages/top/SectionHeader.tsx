import { createMemo } from 'solid-js'

import { useI18n } from '~/i18n/Context'
import type { TextTranslationKey } from '~/i18n/types'
import { Link } from '~/navigation'

import { ListPage } from '../list'

import type { TopPageImageListType } from './config'
import * as styles from './SectionHeader.css'

interface SectionHeaderProps {
	readonly type: TopPageImageListType
}

export function SectionHeader(props: SectionHeaderProps) {
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
				params={/* @once */ props.type}
			>
				{getLabel()}
			</Link>
		</h2>
	)
}
