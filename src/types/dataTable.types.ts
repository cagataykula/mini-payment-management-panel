import type { FilterConfig } from './filterComponents.types'

export interface DataTableProps<T> {
	data: T[]
	columns: Column<T>[]
	filters?: FilterConfig[]
	isLoading?: boolean
	title?: string
	onRowClick?: (row: T) => void
	initialSort?: {
		field: keyof T | string
		direction: SortDirection
	}
	initialFilters?: Record<string, any>
	exportable?: boolean
	exportFilename?: string
}

export interface Column<T> {
	key: keyof T | string
	label: string
	align?: 'left' | 'right' | 'center'
	sortable?: boolean
	render?: (value: any, row: T) => React.ReactNode
}

export type SortDirection = 'asc' | 'desc'
