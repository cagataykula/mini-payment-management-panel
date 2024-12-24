import { PaymentMethodTypes } from '@/types/payment.types'

export const PAYMENT_STATUSES = {
	SUCCESS: 'success',
	PENDING: 'pending',
	FAILED: 'failed'
}

export type ChipColor = 'warning' | 'success' | 'error'
export const STATUS_COLORS: Record<string, ChipColor> = {
	pending: 'warning',
	success: 'success',
	failed: 'error'
}

export const STATUS_LABELS = {
	pending: 'Pending',
	success: 'Successful',
	failed: 'Failed'
}

export const PAYMENT_METHODS = {
	bank_transfer: 'Bank Transfer',
	credit_card: 'Credit Card',
	paypal: 'PayPal'
}
