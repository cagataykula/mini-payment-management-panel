import { convertToCSV } from '@/utils'
import type { Column } from '@/types/dataTable.types'

describe('convertToCSV', () => {
	it('should convert simple data to CSV format', () => {
		const data = [
			{ id: 1, name: 'Cagatay', age: 27 },
			{ id: 2, name: 'Eray', age: 30 }
		]

		const columns: Column<(typeof data)[0]>[] = [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: 'Name' },
			{ key: 'age', label: 'Age' }
		]

		const expected = 'ID,Name,Age\n"1","Cagatay","27"\n"2","Eray","30"'
		expect(convertToCSV(data, columns)).toBe(expected)
	})

	it('should handle custom renderers', () => {
		const data = [
			{ id: 1, status: 'active', lastLogin: new Date('2024-01-01') }
		]

		const columns: Column<(typeof data)[0]>[] = [
			{ key: 'id', label: 'ID' },
			{
				key: 'status',
				label: 'Status',
				render: (value) => value.toUpperCase()
			},
			{
				key: 'lastLogin',
				label: 'Last Login',
				render: (value) => value.toISOString().split('T')[0]
			}
		]

		const expected = 'ID,Status,Last Login\n"1","ACTIVE","2024-01-01"'
		expect(convertToCSV(data, columns)).toBe(expected)
	})

	it('should properly escape special characters', () => {
		const data = [{ id: 1, description: 'Contains "quotes" and, commas' }]

		const columns: Column<(typeof data)[0]>[] = [
			{ key: 'id', label: 'ID' },
			{ key: 'description', label: 'Description' }
		]

		const expected = 'ID,Description\n"1","Contains ""quotes"" and, commas"'
		expect(convertToCSV(data, columns)).toBe(expected)
	})

	it('should handle empty data array', () => {
		const data: Array<{ id: number; name: string }> = []

		const columns: Column<(typeof data)[0]>[] = [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: 'Name' }
		]

		const expected = 'ID,Name'
		expect(convertToCSV(data, columns)).toBe(expected)
	})

	it('should handle null and undefined values', () => {
		const data = [{ id: 1, name: null, description: undefined }]

		const columns: Column<(typeof data)[0]>[] = [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: 'Name' },
			{ key: 'description', label: 'Description' }
		]

		const expected = 'ID,Name,Description\n"1","null","undefined"'
		expect(convertToCSV(data, columns)).toBe(expected)
	})

	it('should handle nested object values', () => {
		const data = [
			{
				id: 1,
				user: { firstName: 'Cagatay', lastName: 'Doe' }
			}
		]

		const columns: Column<(typeof data)[0]>[] = [
			{ key: 'id', label: 'ID' },
			{
				key: 'user',
				label: 'User',
				render: (value) => `${value.firstName} ${value.lastName}`
			}
		]

		const expected = 'ID,User\n"1","Cagatay Doe"'
		expect(convertToCSV(data, columns)).toBe(expected)
	})
})
