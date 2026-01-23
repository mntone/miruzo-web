import LoaderCircle from 'lucide-solid/icons/loader-circle'

import * as styles from './LoadingIndicator.css'

interface LoadingIndicatorProps {
	readonly size: number
}

export function LoadingIndicator(props: LoadingIndicatorProps) {
	return (
		<LoaderCircle
			class={styles.root}
			size={/* @once */ props.size}
		/>
	)
}
