import type { Writable } from '~/@types/utils'
import type { ImageListRequest } from '~/api/types'
import type { ImageEntrySlice, ImageListType } from '~/domain'
import { loadImageEntryList } from '~/repositories'
import { getExcludeFormats } from '~/utils/imageSupport'

import type { TopPageSectionConfigs } from './config'

const ITEM_COUNT_PER_ROW = 10

function buildRequest(type: ImageListType, rows: number, excludeFormats?: readonly string[]): ImageListRequest {
	const request: Writable<ImageListRequest> = {
		type,
		limit: rows * ITEM_COUNT_PER_ROW,
	}
	if (excludeFormats !== undefined) {
		request.excludeFormats = excludeFormats
	}
	return request
}

export function loadTopPageData(configs: TopPageSectionConfigs): Promise<readonly ImageEntrySlice[]> {
	const excludeFormats = getExcludeFormats()
	const tasks = configs.map(function(config) {
		return loadImageEntryList(buildRequest(config.listType, config.maxRows, excludeFormats))
	})
	return Promise.all(tasks)
}
