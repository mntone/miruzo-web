import type dict from './locales/en.json'

export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
export type PluralRecord = Partial<Record<PluralCategory, string>>

export interface LocaleRecord {
	[key: string]: LocaleValue
}

export type LocaleValue = string | LocaleRecord | PluralRecord

type JoinPath<A extends string, B extends string> = A extends '' ? B : `${A}.${B}`

type UnionToIntersection<U> = (
	U extends unknown ? (arg: U) => void : never
) extends (arg: infer R) => void
	? R
	: never

type IsPluralRecord<T> = T extends Record<string, unknown>
	? Exclude<keyof T, PluralCategory> extends never
		? T extends Partial<Record<PluralCategory, string>>
			? true
			: false
		: false
	: false

export type Flatten<T, P extends string = ''> = UnionToIntersection<
	{
		[K in keyof T & string]: T[K] extends string
			? { [Q in JoinPath<P, K>]: T[K] }
			: IsPluralRecord<T[K]> extends true
				? { [Q in JoinPath<P, K>]: T[K] }
				: T[K] extends Record<string, unknown>
					? Flatten<T[K], JoinPath<P, K>>
					: object
	}[keyof T & string]
>

export type LocaleMessages = typeof dict
export type FlatLocaleMessages = Flatten<LocaleMessages>
export type TranslationKey = keyof FlatLocaleMessages

export type TextTranslationKey = {
	[K in keyof FlatLocaleMessages]: FlatLocaleMessages[K] extends string ? K : never
}[keyof FlatLocaleMessages]

export type PluralTranslationKey = {
	[K in keyof FlatLocaleMessages]: FlatLocaleMessages[K] extends PluralRecord ? K : never
}[keyof FlatLocaleMessages]
