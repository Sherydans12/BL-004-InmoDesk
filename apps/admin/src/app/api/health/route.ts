import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Healthcheck básico para Coolify y monitoreo.
 * Confirma que el contenedor está vivo y el servidor Next.js responde.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'BL-004 InmoDesk',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
