import cron from 'node-cron';
import { markCompletedEvents } from './markCompletedEvents';
import { cloneRecurringEvents } from './cloneRecurringEvents';

console.log('[CRON] Setting up recurring jobs...');

cron.schedule('0 3 * * *', async () => {
  console.log('[CRON] Running daily event tasks...');
  await markCompletedEvents();
  await cloneRecurringEvents();
  console.log('[CRON] Daily event tasks complete.');
});
