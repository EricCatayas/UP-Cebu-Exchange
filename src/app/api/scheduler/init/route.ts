import { initializeCronJobs } from '@/config/cron';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await initializeCronJobs();
    return NextResponse.json({
      success: true,
      message: 'Cron jobs initialized successfully',
    });
  } catch (error) {
    console.error('Failed to initialize cron jobs:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize cron jobs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
