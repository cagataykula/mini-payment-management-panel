
import React from 'react';
import type { Column } from '@/types/dataTable.types';

export const convertToCSV = <T extends object>(data: T[], columns: Column<T>[]): string => {
  const headers = columns.map(col => col.label).join(',');

  const rows = data.map(row =>
    columns.map(column => {
      const value = (row as any)[column.key];

      const displayValue = column.render ? column.render(value, row) : value;
      const textValue = React.isValidElement(displayValue) ? value : displayValue;


      const formattedValue = `"${String(textValue).replace(/"/g, '""')}"`;
      return formattedValue;
    }).join(',')
  );

  return [headers, ...rows].join('\n');
};