import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/services/db';

export async function GET() {
  try {
    return NextResponse.json(getSettings());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    saveSettings(body);
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
