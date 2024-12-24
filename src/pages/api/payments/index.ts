import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const API_FAKE_TIMER = 1000

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const filePath = path.join(process.cwd(), 'public', 'data', 'payments.json')

	if (req.method === 'GET') {
		const payments = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		setTimeout(() => {
			res.status(200).json(payments)
		}, API_FAKE_TIMER)
	} else {
		res.setHeader('Allow', ['GET'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
