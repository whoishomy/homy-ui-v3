import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const OBSERVATION_FILE = path.join(process.cwd(), 'memory/eren-observation.json');

export async function GET() {
  try {
    const data = await fs.readFile(OBSERVATION_FILE, 'utf-8');
    const observations = JSON.parse(data);
    return NextResponse.json(observations);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Dosya yoksa boş bir array dön
      return NextResponse.json([]);
    }
    console.error('Error reading observations:', error);
    return NextResponse.json({ error: 'Failed to fetch observations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const observation = await request.json();

    // Mevcut gözlemleri oku
    let observations = [];
    try {
      const data = await fs.readFile(OBSERVATION_FILE, 'utf-8');
      observations = JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    // Yeni gözlemi ekle
    const newObservation = {
      ...observation,
      createdAt: new Date().toISOString(),
    };
    observations.push(newObservation);

    // Dosyaya kaydet
    await fs.writeFile(OBSERVATION_FILE, JSON.stringify(observations, null, 2));

    return NextResponse.json(newObservation, { status: 201 });
  } catch (error) {
    console.error('Error saving observation:', error);
    return NextResponse.json({ error: 'Failed to save observation' }, { status: 500 });
  }
}
