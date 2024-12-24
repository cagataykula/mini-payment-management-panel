import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DefaultLayout from '@/layouts/DefaultLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Skeleton,
  Grid2 as Grid,
  Alert,
  AlertTitle,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Schedule,
  Description,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  Pending,
  Edit,
  Person,
  Email,
  LocalOffer,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { usePaymentDataContext } from '@/context/PaymentDataContext';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from './constants'
import { updatePaymentStatus } from '@/services';
import type { Payment, PaymentStatusTypes } from '../../types/payment.types';

const StatusChip = React.memo(({
  status,
  onEdit,
  isEditing
}: {
  status: string;
  onEdit: () => void;
  isEditing: boolean;
}) => {
  const statusConfig = useMemo(() => {
    switch (status.toLowerCase()) {
      case PAYMENT_STATUSES.SUCCESS:
        return { color: 'success', icon: <CheckCircle />, label: status };
      case PAYMENT_STATUSES.PENDING:
        return { color: 'warning', icon: <Pending />, label: status };
      case PAYMENT_STATUSES.FAILED:
        return { color: 'error', icon: <ErrorIcon />, label: status };
      default:
        return { color: 'default', icon: <Info />, label: status };
    }
  }, [status]);

  return (
    <Chip
      icon={statusConfig.icon}
      label={statusConfig.label}
      color={statusConfig.color as any}
      variant="filled"
      onClick={onEdit}
      onDelete={isEditing ? undefined : onEdit}
      deleteIcon={<Edit />}
      sx={{
        textTransform: 'capitalize',
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.9,
        },
      }}
    />
  );
});

StatusChip.displayName = 'StatusChip';

const PaymentDetailItem = React.memo(({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <Box display="flex" alignItems="center" gap={2} mb={2}>
    {icon}
    <Box>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
));

PaymentDetailItem.displayName = 'PaymentDetailItem';

export default function PaymentDetail() {
  const { fetchPaymentData } = usePaymentDataContext()
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPaymentDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/${id}`);
      if (!res.ok) {
        throw new Error(`Payment not found (${res.status})`);
      }
      const data = await res.json();
      setPayment(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching payment details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPaymentDetails();
    }
  }, [id, fetchPaymentDetails]);

  const handleStatusUpdate = async (newStatus: PaymentStatusTypes) => {
    try {
      setStatusLoading(true)
      const result = await updatePaymentStatus({ id, status: newStatus });

      if ('error' in result) {
        throw result.error;
      }

      setPayment(result.data);
      setSnackbar({
        open: true,
        message: 'Payment status updated successfully',
        severity: 'success',
      });
      fetchPaymentData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update payment status',
        severity: 'error',
      });
    } finally {
      setIsEditingStatus(false);
      setStatusLoading(false)
    }
  };

  const handleStatusEdit = () => {
    setIsEditingStatus(true);
  };

  const handleStatusChange = (event: any) => {
    handleStatusUpdate(event.target.value as PaymentStatusTypes);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const LoadingSkeleton = React.memo(() => (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={32} width={200} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
    </Stack>
  ));


  const renderStatus = useMemo(() => {
    if (!payment) return null;

    if (statusLoading) {
      return (
        <Box sx={{ display: 'flex', mr: 5 }}>
          <CircularProgress size="30px" />
        </Box>

      )
    }
    if (isEditingStatus) {
      return (
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={payment.status}
            onChange={handleStatusChange}
            label="Status"
            autoFocus
            onBlur={() => setIsEditingStatus(false)}
            sx={{ width: 150 }}
          >
            <MenuItem value={PAYMENT_STATUSES.SUCCESS}>Successfull</MenuItem>
            <MenuItem value={PAYMENT_STATUSES.PENDING}>Pending</MenuItem>
            <MenuItem value={PAYMENT_STATUSES.FAILED}>Failed</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <StatusChip
        status={payment.status}
        onEdit={handleStatusEdit}
        isEditing={isEditingStatus}
      />
    );
  }, [payment, isEditingStatus, statusLoading]);

  return (
    <DefaultLayout title={`Payment: ${id}`}>
      <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
        <Card elevation={3}>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            ) : payment ? (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" component="h1">
                    Payment Details
                  </Typography>
                  {renderStatus}
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={{xs: 0, md: 3}}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <PaymentDetailItem
                      icon={<Info color="primary" />}
                      label="Payment ID"
                      value={payment.id}
                    />
                    <PaymentDetailItem
                      icon={<Person color="primary" />}
                      label="Name Surname"
                      value={`${payment.name} ${payment.surname}`}
                    />
                    <PaymentDetailItem
                      icon={<Email color="primary" />}
                      label="Email"
                      value={`${payment.email}`}
                    />
                    <PaymentDetailItem
                      icon={<Description color="primary" />}
                      label="Transaction Notes"
                      value={payment.transaction_notes}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <PaymentDetailItem
                      icon={<LocalOffer color="primary" />}
                      label="Amount"
                      value={new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      }).format(payment.amount)}
                    />
                    <PaymentDetailItem
                      icon={<PaymentIcon color="primary" />}
                      label="Payment Method"
                      value={PAYMENT_METHODS[payment.payment_method]}
                    />
                    <PaymentDetailItem
                      icon={<Schedule color="primary" />}
                      label="Date Time"
                      value={dayjs(payment.timestamp).format('DD/MM/YYYY HH:mm')}
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <Alert severity="warning">
                <AlertTitle>Not Found</AlertTitle>
                Payment details could not be found.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DefaultLayout>
  );
}