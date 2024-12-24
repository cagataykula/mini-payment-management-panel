import { Payment } from '@/types/payment.types'
import axios, { AxiosError, AxiosResponse } from 'axios'

type StatusType = Payment['status']

export const getPayments = async () => {
	try {
		const { data, status, headers }: AxiosResponse<Payment[]> = await axios('/api/payments')
		return {
			data,
			status,
			headers
		}
	} catch (error) {
		return {
			error: error as AxiosError
		}
	}
}

export const updatePaymentStatus = async ({ id, status: newStatus }: {id: string | number, status: StatusType}) => {
	try {
		const { data, status, headers }: AxiosResponse<Payment> = await axios.put(`/api/payments/${id}`, {
			status: newStatus
		})

		return {
			data,
			status,
			headers
		}
	} catch (error) {
		return {
			error: error as AxiosError
		}
	}
}
