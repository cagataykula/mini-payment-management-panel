export type PaymentMethodTypes = 'credit_card' | 'bank_transfer' | 'paypal'
export type PaymentStatusTypes = 'success' | 'failed' | 'pending'

export interface Payment {
	id: string
	name: string
	surname: string
	email: string
	payment_method: PaymentMethodTypes
	amount: number
	transaction_notes: string
	timestamp: string
	status: PaymentStatusTypes
}
