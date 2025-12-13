import type dict from './locales/en.json'

export interface LocaleRecord {
	[key: string]: string | LocaleRecord
}

type JoinPath<A extends string, B extends string> = A extends '' ? B : `${A}.${B}`

type UnionToIntersection<U> = (
	U extends unknown ? (arg: U) => void : never
) extends (arg: infer R) => void
	? R
	: never

export type Flatten<T, P extends string = ''> = UnionToIntersection<
	{
		[K in keyof T & string]: T[K] extends string
			? { [Q in JoinPath<P, K>]: T[K] }
			: T[K] extends Record<string, unknown>
				? Flatten<T[K], JoinPath<P, K>>
				: object
	}[keyof T & string]
>

export type LocaleMessages = typeof dict
export type FlatLocaleMessages = Flatten<LocaleMessages>
export type TranslationKey = keyof FlatLocaleMessages
