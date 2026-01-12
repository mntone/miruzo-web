const templateArgumentPattern = /\{(\d+)\}/g

export function formatWithArgument(template: string, args: readonly string[]): string {
	if (args.length === 0) {
		return template
	}

	return template.replace(templateArgumentPattern, function(match, rawIndex) {
		const index = Number(rawIndex)
		if (index < args.length) {
			return args[index]
		}
		return match
	})
}

const numeralPattern = /\{0\}/g

export function formatNumeralMessage(
	template: string,
	count: number,
	formatNumber: (value: number) => string,
): string {
	return template.replace(numeralPattern, formatNumber(count))
}
