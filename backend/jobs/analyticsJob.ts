import cron from 'node-cron';
import { getDailyActiveUsers, getFeatureUsage, getChatEngagement, getUserRetention } from '../services/analyticsService';
import AnalyticsSnapshot from '../models/AnalyticsSnapshot';

/**
 * Start scheduled analytics computation job
 * Runs every day at 2 AM and saves a snapshot of aggregated analytics
 */
async function startAnalyticsJob(): Promise<void> {
  // Schedule job to run every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log(`[AnalyticsJob] Starting analytics snapshot computation...`);

      // Compute analytics for the last 1 day
      const dau = await getDailyActiveUsers(1);
      const featureUsage = await getFeatureUsage(1);
      const chatMetrics = await getChatEngagement(1);
      const retention = await getUserRetention();

      // Extract values from results
      const dauCount = dau && dau.length > 0 ? dau[0].users : 0;
      const featureData = featureUsage.data || featureUsage;
      const chatData = chatMetrics.data || chatMetrics;
      const retentionData = retention.data || retention;

      // Create and save analytics snapshot
      const snapshot = await AnalyticsSnapshot.create({
        date: new Date(),
        dau: dauCount,
        featureUsage: featureData,
        chatMetrics: chatData,
        retention: retentionData
      });

      const dateStr = new Date().toISOString().split('T')[0];
      console.log(`[AnalyticsJob] Analytics snapshot created for ${dateStr}`);
      console.log(`[AnalyticsJob] Snapshot ID: ${snapshot._id}`);
    } catch (error) {
      console.error(`[AnalyticsJob] Error computing analytics snapshot:`, error);
    }
  });

  console.log('[AnalyticsJob] Scheduled analytics job initialized (runs daily at 2 AM)');
}

export { startAnalyticsJob };
