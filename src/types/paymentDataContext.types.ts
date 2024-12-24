import { ReactNode } from 'react'
import { Payment } from './payment.types'

export interface PaymentDataContextValue {
	paymentData: Payment[]
	isLoading: boolean
	fetchPaymentData: () => Promise<void>
}
