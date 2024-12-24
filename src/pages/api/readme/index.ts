import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = path.join(process.cwd(), 'README.md');
    
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    res.status(200).json({ content: fileContent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read README.md file' });
  }
}
