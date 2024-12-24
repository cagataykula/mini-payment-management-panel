import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Card,
  TablePagination,
  Typography,
  Skeleton,
  SortDirection,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import { DateRangeFilter, NumberFilter, SelectFilter, TextFilter } from './FilterComponents';
import type { FilterConfig } from '../../types/filterComponents.types';
import type { DataTableProps } from '../../types/dataTable.types';
import { convertToCSV, downloadFile } from '@/utils';

dayjs.extend(isBetween)

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  filters = [],
  isLoading = false,
  title,
  onRowClick,
  initialSort,
  initialFilters = {},
  exportable,
  exportFilename = 'exported-data.csv'
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    field: keyof T | string;
    direction: SortDirection;
  }>(initialSort || { field: 'id', direction: 'desc' });
  const [filterValues, setFilterValues] = useState<Record<string, any>>(initialFilters);

  const handleExport = () => {
    const csvContent = convertToCSV(filteredAndSortedData, columns);
    downloadFile(csvContent, exportFilename);
  };

  const handleSort = (field: keyof T | string) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(current => ({
      ...current,
      [key]: value
    }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setPage(0);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    filtered = filtered.filter(item =>
      Object.entries(filterValues).every(([key, value]) => {
        if (!value) return true;

        const filterConfig = filters.find(f => f.key === key);
        const itemValue = (item as any)[filterConfig?.filterFor ?? key];
        switch (filterConfig?.type) {
          case 'dateRange':
            if (value.start && value.end) {
              return dayjs(itemValue).isBetween(dayjs(value.start), dayjs(value.end), null, '[]');
            }
            return true;
          case 'select':
            return value === itemValue;
          case 'number':
            if (filterConfig?.comparisonType == 'greater') {
              return itemValue > value;
            } else if (filterConfig?.comparisonType == 'less') {
              return itemValue < value;
            } else if (filterConfig?.comparisonType == 'greaterOrEqual') {
              return itemValue >= value;
            } else if (filterConfig?.comparisonType == 'lessOrEqual') {
              return itemValue <= value;
            }
            return itemValue === value;
          default:
            if (filterConfig?.searchKeys) {
              return filterConfig.searchKeys.some((searchKey: string) => {
                const fieldValue = (item as any)[searchKey];
                return fieldValue && String(fieldValue)
                  .toLowerCase()
                  .includes(String(value).toLowerCase());
              });
            } else {
              const fieldValue = (item as any)[key];
              return fieldValue && String(fieldValue)
                .toLowerCase()
                .includes(String(value).toLowerCase());
            }
        }
      })
    );

    return filtered.sort((a, b) => {
      const aValue = (a as any)[sortConfig.field];
      const bValue = (b as any)[sortConfig.field];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, filterValues, sortConfig]);

  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderFilterComponent = (filterConfig: FilterConfig) => {
    const value = filterValues[filterConfig.key];
    const handleChange = (newValue: any) => handleFilterChange(filterConfig.key, newValue);

    switch (filterConfig.type) {
      case 'text':
        return (
          <TextFilter
            label={filterConfig.label}
            value={value || ''}
            onChange={handleChange}
            placeholder={filterConfig.placeholder}
          />
        );

      case 'number':
        return (
          <NumberFilter
            label={filterConfig.label}
            value={value || ''}
            onChange={handleChange}
          />
        );

      case 'select':
        return (
          <SelectFilter
            label={filterConfig.label}
            value={value || ''}
            onChange={handleChange}
            options={filterConfig.options}
          />
        );

      case 'dateRange':
        return (
          <DateRangeFilter
            label={filterConfig.label}
            value={value}
            onChange={handleChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card elevation={2} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {title && (
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        )}
        <Box display="flex">
          {
            filters.length > 0 && (
              <Box>
                <Button
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ mr: 1 }}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                {showFilters && Object.keys(filterValues).length > 0 && (
                  <Button
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            )
          }
          {
            exportable && (
              <Button
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                variant="contained"
                disabled={isLoading || filteredAndSortedData.length === 0}
              >
                Export
              </Button>
            )
          }
        </Box>
      </Box>

      {showFilters && filters.length > 0 && (
        <Box sx={{
          mb: 3, display: 'grid', gap: 2, gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
            lg: 'repeat(3, 1fr)'
          }
        }}>
          {filters.map((filter) => (
            <Box key={filter.key}>{renderFilterComponent(filter)}</Box>
          ))}
        </Box>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  align={column.align || 'left'}
                  onClick={() => column.sortable && handleSort(column.key)}
                  sx={{
                    cursor: column.sortable ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent={column.align === 'right' ? 'flex-end' : 'flex-start'}>
                    {column.label}
                    {column.sortable && sortConfig.field === column.key && (
                      <Box component="span" ml={0.5}>
                        {sortConfig.direction === 'asc' ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="textSecondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} align={column.align || 'left'}>
                      {column.render
                        ? column.render((row as any)[column.key], row)
                        : (row as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredAndSortedData.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  );
}