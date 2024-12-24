export type FilterType = 'text' | 'number' | 'select' | 'dateRange'

export interface BaseFilter {
	key: string
	label: string
	type: FilterType
	filterFor?: string
}

export interface TextFilter extends BaseFilter {
	type: 'text'
	searchKeys?: string[]
	placeholder?: string
}

export interface NumberFilter extends BaseFilter {
	type: 'number'
	comparisonType?:
		| 'greater'
		| 'less'
		| 'equal'
		| 'greaterOrEqual'
		| 'lessOrEqual'
}

export interface SelectFilter extends BaseFilter {
	type: 'select'
	options: { value: string; label: string }[]
}

export interface DateRangeFilter extends BaseFilter {
	type: 'dateRange'
}

export type FilterConfig =
	| TextFilter
	| NumberFilter
	| SelectFilter
	| DateRangeFilter
