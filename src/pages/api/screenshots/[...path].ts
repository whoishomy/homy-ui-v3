import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = process.env.SCREENSHOTS_DIR || 'docs/screenshots';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: pathSegments } = req.query;

  if (!pathSegments || !Array.isArray(pathSegments)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const filePath = path.join(SCREENSHOTS_DIR, ...pathSegments);

  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error serving screenshot:', error);
    res.status(404).json({ error: 'Screenshot not found' });
  }
}
