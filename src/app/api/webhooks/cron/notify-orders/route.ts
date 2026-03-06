import RentalOrder from '@/models/sequelize/RentalOrder';
import { orderStartReminderNotification, orderReturnReminderNotification } from '@/lib/notifications';
import { NextRequest, NextResponse } from 'next/server';
import { notifyOrdersDueReturn, notifyOrdersDueStart } from '@/config/cron';

export async function POST(request: NextRequest) {
  // Security: Verify the request is from your cron service
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = {
      startReminders: 0,
      returnReminders: 0,
      errors: [] as string[],
    };

    // Check for orders due to start
    await notifyOrdersDueStart();

    // Check for orders due to return
    await notifyOrdersDueReturn();

    return NextResponse.json({
      success: true,
      message: 'Notifications processed',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error processing notifications:', error);
    return NextResponse.json(
      {
        error: 'Failed to process notifications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
