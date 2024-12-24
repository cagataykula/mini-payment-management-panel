import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import type { Payment, PaymentStatusTypes } from '@/types/payment.types'

const API_FAKE_TIMER = 1000
const filePath = path.join(process.cwd(), 'public', 'data', 'payments.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query

	if (!id) {
		res.status(400).json({ error: 'Invalid or missing id parameter' })
		return
	}

	if (req.method === 'GET') {
		const payments = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		const payment: Payment | undefined = payments.find(
			(item: Payment) => item.id === id
		)

		setTimeout(() => {
			if (payment) {
				res.status(200).json(payment)
			} else {
				res.status(404).json({ error: `Payment with ID ${id} not found` })
			}
		}, API_FAKE_TIMER)
	} else if (req.method === 'PUT') {
		const payments: Payment[] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		const paymentIndex = payments.findIndex((item: Payment) => item.id === id)

		if (paymentIndex === -1) {
			setTimeout(() => {
				res.status(404).json({ error: `Payment with ID ${id} not found` })
			}, API_FAKE_TIMER)
			return
		}

		const { status } = req.body as { status: PaymentStatusTypes }

		if (!status) {
			res
				.status(400)
				.json({ error: 'Invalid or missing status field in request body' })
			return
		}

		setTimeout(() => {
			payments[paymentIndex].status = status

			fs.writeFileSync(filePath, JSON.stringify(payments, null, 2), 'utf8')

			res.status(200).json(payments[paymentIndex])
		}, API_FAKE_TIMER)
	} else {
		res.setHeader('Allow', ['GET', 'PUT'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
