import cron from 'node-cron';
import RentalOrder from '@/models/sequelize/RentalOrder';
import { orderStartReminderNotification, orderReturnReminderNotification } from '@/lib/notifications';

let schedulerActive = false;

/**
 * Initialize all rental order notification jobs
 */
export async function initializeCronJobs() {
  if (schedulerActive) {
    console.warn('⚠️ Cron jobs already initialized');
    return;
  }

  try {
    // ┌───────────── minute (0-59)
    // │ ┌─────────── hour (0-23)
    // │ │ ┌───────── day of month (1-31)
    // │ │ │ ┌─────── month (1-12)
    // │ │ │ │ ┌───── day of week (0-6, 0=Sunday)
    // │ │ │ │ │
    // * * * * *
    // Common Scheduling Patterns
    // * * * * * — Every minute.
    // 0 * * * * — Every hour at the start (minute 0).
    // 0 8 * * * — Every day at 8:00 AM.
    // */15 * * * * — Every 15 minutes.
    // 0 0 1 * * — On the first day of every month at midnight.
    // Job 1: Check for orders due to start - runs once daily at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
      await notifyOrdersDueStart();
    });
    console.info('✅ Order start reminder job scheduled (daily at 8:00 AM)');

    // Job 2: Check for orders due to return - runs once daily at 8:30 AM
    cron.schedule('30 8 * * *', async () => {
      await notifyOrdersDueReturn();
    });
    console.info('✅ Order return reminder job scheduled (daily at 8:30 AM)');

    schedulerActive = true;
    console.info('✅ All cron jobs initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing cron jobs:', error);
    throw error;
  }
}

/**
 * Send start reminders for orders due to start within 24 hours
 */
export async function notifyOrdersDueStart() {
  try {
    console.info('📋 Checking for orders due to start...');

    // Get orders starting within the next 24 hours
    const orders = await RentalOrder.getOrdersDueStart(1);

    if (orders.length === 0) {
      console.info('✓ No orders due to start at this time');
      return;
    }

    console.info(`📧 Found ${orders.length} order(s) due to start, sending notifications...`);

    for (const orderData of orders) {
      const order = orderData.toJSON();
      try {
        await orderStartReminderNotification(order);
        console.info(`✓ Start reminder sent for order ID: ${order.id}`);
      } catch (error) {
        console.error(`✗ Failed to send start reminder for order ID ${order.id}:`, error);
        // Continue with next order instead of breaking
      }
    }
  } catch (error) {
    console.error('❌ Error in notifyOrdersDueStart job:', error);
  }
}

/**
 * Send return reminders for orders due to return within 24 hours
 */
export async function notifyOrdersDueReturn() {
  try {
    console.info('📋 Checking for orders due to return...');

    // Get orders ending within the next 24 hours
    const orders = await RentalOrder.getOrdersDueReturn(1);

    if (orders.length === 0) {
      console.info('✓ No orders due to return at this time');
      return;
    }

    console.info(`📧 Found ${orders.length} order(s) due to return, sending notifications...`);

    for (const orderData of orders) {
      const order = orderData.toJSON();
      try {
        // Get user data which is needed for the notification
        const user = order.user;
        if (user) {
          await orderReturnReminderNotification(order, {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
          });
          console.info(`✓ Return reminder sent for order ID: ${order.id}`);
        } else {
          console.warn(`⚠️ User not found for order ID ${order.id}, skipping notification`);
        }
      } catch (error) {
        console.error(`✗ Failed to send return reminder for order ID ${order.id}:`, error);
        // Continue with next order instead of breaking
      }
    }
  } catch (error) {
    console.error('❌ Error in notifyOrdersDueReturn job:', error);
  }
}

/**
 * Gracefully stop all cron jobs
 */
export function stopCronJobs() {
  cron.getTasks().forEach((task) => {
    task.stop();
  });
  schedulerActive = false;
  console.info('🛑 All cron jobs stopped');
}

/**
 * Get current scheduler status
 */
export function isSchedulerActive(): boolean {
  return schedulerActive;
}
