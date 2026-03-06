import { isSchedulerActive } from '@/config/cron';
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const active = isSchedulerActive();

  return NextResponse.json({
    scheduler: {
      active,
      status: active ? '✅ Running' : '⛔ Not running',
      nextStartCheck: 'Every day at 8:00 AM',
      nextReturnCheck: 'Every day at 8:30 AM',
    },
  });
}
