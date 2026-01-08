import { createSignal } from 'solid-js'

import { Header } from '~/components/Header/Header'
import { ImageLayoutController, GridImageLayout, MasonryImageLayout } from '~/components/ImageLayout'

export function HomePage() {
	const [getLayout, setLayout] = createSignal('masonry')
	return (
		<>
			<Header />
			<select
				name='layout'
				title='Layout'
				value={getLayout()}
				onInput={function(event) {
					setLayout((event.target as HTMLSelectElement).value)
				}}
			>
				<option value='grid'>Grid</option>
				<option value='masonry'>Masonry</option>
			</select>

			<ImageLayoutController
				layout={getLayout() === 'grid' ? GridImageLayout : MasonryImageLayout}
				listType='latest'
			/>
		</>
	)
}
