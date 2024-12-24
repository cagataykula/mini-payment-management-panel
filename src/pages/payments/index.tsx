import React from 'react';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Chip } from '@mui/material';
import dayjs from 'dayjs';
import { usePaymentDataContext } from '@/context/PaymentDataContext';
import { useRouter } from 'next/router';
import DataTable from '@/components/DataTable';
import { STATUS_LABELS, STATUS_COLORS } from './constants'
import type { Payment } from '../../types/payment.types'
import type { FilterConfig } from '@/types/filterComponents.types';
import type { Column } from '@/types/dataTable.types';

export default function Home() {
  const { paymentData, isLoading } = usePaymentDataContext();
  const router = useRouter()

  const columns: Column<Payment>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
    },
    {
      key: 'nameSurname',
      label: 'Name Surname',
      align: 'right' as const,
      sortable: true,
      render: (_: string, row: Payment) => `${row.name} ${row.surname}`
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right' as const,
      sortable: true,
      render: (value: number) => new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(value),
    },
    {
      key: 'timestamp',
      label: 'Date',
      align: 'right' as const,
      sortable: true,
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'right' as const,
      render: (value: keyof typeof STATUS_LABELS) => (
        <Chip
          label={STATUS_LABELS[value]}
          color={STATUS_COLORS[value]}
          size="small"
        />
      ),
    },
  ];

  const filters: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      searchKeys: ['id', 'name', 'surname'],
      placeholder: 'Write id or customer name'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: Object.entries(STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: 'amount',
      filterFor: 'amount',
      label: 'Min. Amount',
      type: 'number',
      comparisonType: 'greater'
    },
    {
      key: 'amount_2',
      filterFor: 'amount',
      label: 'Max. Amount',
      type: 'number',
      comparisonType: 'less'
    },
    {
      key: 'timestamp',
      label: 'Date',
      type: 'dateRange',
    },
  ];

  return (
    <DefaultLayout title="Payments">
      <DataTable<Payment>
        title="Payments"
        initialSort={{ field: 'timestamp', direction: 'desc' }}
        columns={columns}
        data={paymentData}
        isLoading={isLoading}
        filters={filters}
        onRowClick={(row) => router.push(`/payments/${row.id}`)}
        exportable
        exportFilename='payments-data.csv'
      />
    </DefaultLayout>
  )
}
