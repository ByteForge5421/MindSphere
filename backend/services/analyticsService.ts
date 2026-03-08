import Event from '../models/Event';

interface DailyActiveUsersResult {
  date: string;
  users: number;
}

interface FeatureUsageResult {
  mood_logged: number;
  journal_created: number;
  message_sent: number;
  community_joined: number;
}

interface ChatEngagementResult {
  totalMessages: number;
  avgMessageLength: number;
  uniqueUsers: number;
  messagesPerUser: number;
}

interface UserRetentionResult {
  totalUsers: number;
  day1Retention: number;
  day7Retention: number;
  day30Retention: number;
}

interface ActivityHeatmapResult {
  day: number;
  hour: number;
  count: number;
}

interface MoodInsightsResult {
  insights: string[];
}

interface MoodPredictionResult {
  predictedMood: number | null;
  message?: string;
}

/**
 * Get daily active users for the last N days
 * Only counts user_login events
 * @param days - Number of days to look back
 * @returns Array of daily user counts with dates
 */
async function getDailyActiveUsers(days: number): Promise<DailyActiveUsersResult[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Event.aggregate([
      {
        $match: {
          eventType: 'user_login',
          createdAt: {
            $gte: cutoffDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          uniqueUsers: {
            $addToSet: '$userId'
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          users: {
            $size: '$uniqueUsers'
          }
        }
      },
      {
        $sort: {
          date: 1
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error('[AnalyticsService] Error calculating daily active users:', error);
    throw error;
  }
}

/**
 * Get feature usage statistics for the last N days
 * Counts occurrences of: mood_logged, journal_created, message_sent, community_joined
 * @param days - Number of days to look back
 * @returns Object with count of each feature usage type
 */
async function getFeatureUsage(days: number): Promise<FeatureUsageResult> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Event.aggregate([
      {
        $match: {
          eventType: {
            $in: ['mood_logged', 'journal_created', 'message_sent', 'community_joined']
          },
          createdAt: {
            $gte: cutoffDate
          }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: {
            $sum: 1
          }
        }
      }
    ]);

    // Initialize with default 0 values
    const usage: FeatureUsageResult = {
      mood_logged: 0,
      journal_created: 0,
      message_sent: 0,
      community_joined: 0
    };

    // Populate counts from aggregation results
    result.forEach((item: any) => {
      if (item._id in usage) {
        usage[item._id as keyof FeatureUsageResult] = item.count;
      }
    });

    return usage;
  } catch (error) {
    console.error('[AnalyticsService] Error calculating feature usage:', error);
    throw error;
  }
}

/**
 * Get chat engagement statistics for the last N days
 * Analyzes message_sent events to calculate engagement metrics
 * @param days - Number of days to look back
 * @returns Object with chat engagement metrics
 */
async function getChatEngagement(days: number): Promise<ChatEngagementResult> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Event.aggregate([
      {
        $match: {
          eventType: 'message_sent',
          createdAt: {
            $gte: cutoffDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalMessages: {
            $sum: 1
          },
          avgMessageLength: {
            $avg: '$metadata.messageLength'
          },
          uniqueUsers: {
            $addToSet: '$userId'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalMessages: 1,
          avgMessageLength: {
            $round: ['$avgMessageLength', 2]
          },
          uniqueUsersCount: {
            $size: '$uniqueUsers'
          }
        }
      }
    ]);

    // Handle case when no messages found
    if (result.length === 0) {
      return {
        totalMessages: 0,
        avgMessageLength: 0,
        uniqueUsers: 0,
        messagesPerUser: 0
      };
    }

    const data = result[0];
    const totalMessages = data.totalMessages || 0;
    const uniqueUsers = data.uniqueUsersCount || 0;
    const avgMessageLength = data.avgMessageLength || 0;
    const messagesPerUser = uniqueUsers > 0 ? parseFloat((totalMessages / uniqueUsers).toFixed(2)) : 0;

    return {
      totalMessages,
      avgMessageLength,
      uniqueUsers,
      messagesPerUser
    };
  } catch (error) {
    console.error('[AnalyticsService] Error calculating chat engagement:', error);
    throw error;
  }
}

/**
 * Calculate user retention metrics (Day-1, Day-7, Day-30)
 * Based on user_login events, checks if users returned after first login
 * @returns Object with total users and retention percentages
 */
async function getUserRetention(): Promise<UserRetentionResult> {
  try {
    // Retrieve all user login events sorted by user and date
    const loginEvents = await Event.find({
      eventType: 'user_login'
    }).sort({ userId: 1, createdAt: 1 });

    if (loginEvents.length === 0) {
      return {
        totalUsers: 0,
        day1Retention: 0,
        day7Retention: 0,
        day30Retention: 0
      };
    }

    // Group logins by user and track first login date
    const userFirstLogins = new Map<string, Date>();
    const userLogins = new Map<string, Date[]>();

    loginEvents.forEach((event) => {
      const userId = event.userId.toString();
      if (!userFirstLogins.has(userId)) {
        userFirstLogins.set(userId, event.createdAt);
        userLogins.set(userId, [event.createdAt]);
      } else {
        userLogins.get(userId)!.push(event.createdAt);
      }
    });

    const totalUsers = userFirstLogins.size;
    let day1Count = 0;
    let day7Count = 0;
    let day30Count = 0;

    // Check retention for each user based on return login dates
    userFirstLogins.forEach((firstLogin, userId) => {
      const loginDates = userLogins.get(userId)!;

      // Calculate retention thresholds
      const day1Date = new Date(firstLogin);
      day1Date.setDate(day1Date.getDate() + 1);

      const day7Date = new Date(firstLogin);
      day7Date.setDate(day7Date.getDate() + 7);

      const day30Date = new Date(firstLogin);
      day30Date.setDate(day30Date.getDate() + 30);

      // Count users who returned on or after each threshold
      if (loginDates.some((date) => date >= day1Date)) day1Count++;
      if (loginDates.some((date) => date >= day7Date)) day7Count++;
      if (loginDates.some((date) => date >= day30Date)) day30Count++;
    });

    // Calculate retention percentages rounded to 2 decimal places
    const day1Retention = parseFloat(((day1Count / totalUsers) * 100).toFixed(2));
    const day7Retention = parseFloat(((day7Count / totalUsers) * 100).toFixed(2));
    const day30Retention = parseFloat(((day30Count / totalUsers) * 100).toFixed(2));

    return {
      totalUsers,
      day1Retention,
      day7Retention,
      day30Retention
    };
  } catch (error) {
    console.error('[AnalyticsService] Error calculating user retention:', error);
    throw error;
  }
}

/**
 * Calculate user activity heatmap by day of week and hour of day
 * Analyzes message_sent, mood_logged, journal_created, and community_joined events
 * @param days - Number of days to look back
 * @returns Array of activity counts grouped by day and hour
 */
async function getUserActivityHeatmap(days: number): Promise<ActivityHeatmapResult[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Event.aggregate([
      {
        $match: {
          eventType: {
            $in: ['message_sent', 'mood_logged', 'journal_created', 'community_joined']
          },
          createdAt: {
            $gte: cutoffDate
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: '$createdAt' },
            hour: { $hour: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          day: '$_id.day',
          hour: '$_id.hour',
          count: 1
        }
      },
      {
        $sort: {
          day: 1,
          hour: 1
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error('[AnalyticsService] Error calculating user activity heatmap:', error);
    throw error;
  }
}

/**
 * Analyze user mood patterns and generate behavioral insights
 * @param userId - The user ID to analyze
 * @returns Object containing array of mood insights
 */
async function analyzeMoodPatterns(userId: string): Promise<MoodInsightsResult> {
  try {
    // Fetch user's relevant events
    const events = await Event.find({
      userId,
      eventType: { $in: ['mood_logged', 'journal_created', 'message_sent'] }
    }).sort({ createdAt: 1 });

    if (events.length === 0) {
      return { insights: ['Insufficient data for mood analysis'] };
    }

    // Build daily summaries
    const dailySummaries = new Map<string, {
      mood: number | null;
      journalCount: number;
      messageCount: number;
      date: Date;
      dayOfWeek: number;
    }>();

    events.forEach((event) => {
      const dateStr = event.createdAt.toISOString().split('T')[0];
      if (!dailySummaries.has(dateStr)) {
        const dayOfWeek = new Date(event.createdAt).getDay();
        dailySummaries.set(dateStr, {
          mood: null,
          journalCount: 0,
          messageCount: 0,
          date: event.createdAt,
          dayOfWeek
        });
      }

      const summary = dailySummaries.get(dateStr)!;
      if (event.eventType === 'mood_logged' && event.metadata?.mood !== undefined) {
        summary.mood = event.metadata.mood;
      } else if (event.eventType === 'journal_created') {
        summary.journalCount++;
      } else if (event.eventType === 'message_sent') {
        summary.messageCount++;
      }
    });

    const insights: string[] = [];
    const summaries = Array.from(dailySummaries.values());
    const summariesWithMood = summaries.filter(s => s.mood !== null);

    // Need minimum data for analysis
    if (summariesWithMood.length < 3) {
      return { insights: ['Insufficient data for mood analysis'] };
    }

    // Analyze journaling effect on mood
    const daysWithJournal = summaries.filter(s => s.journalCount > 0 && s.mood !== null);
    const daysWithoutJournal = summaries.filter(s => s.journalCount === 0 && s.mood !== null);

    if (daysWithJournal.length > 0 && daysWithoutJournal.length > 0) {
      const avgMoodWithJournal = daysWithJournal.reduce((sum, s) => sum + (s.mood || 0), 0) / daysWithJournal.length;
      const avgMoodWithoutJournal = daysWithoutJournal.reduce((sum, s) => sum + (s.mood || 0), 0) / daysWithoutJournal.length;

      if (avgMoodWithJournal > avgMoodWithoutJournal) {
        insights.push('Journaling appears to improve your mood');
      }
    }

    // Analyze messaging/community effect on mood
    const daysWithMessages = summaries.filter(s => s.messageCount > 0 && s.mood !== null);
    const daysWithoutMessages = summaries.filter(s => s.messageCount === 0 && s.mood !== null);

    if (daysWithMessages.length > 0 && daysWithoutMessages.length > 0) {
      const avgMoodWithMessages = daysWithMessages.reduce((sum, s) => sum + (s.mood || 0), 0) / daysWithMessages.length;
      const avgMoodWithoutMessages = daysWithoutMessages.reduce((sum, s) => sum + (s.mood || 0), 0) / daysWithoutMessages.length;

      if (avgMoodWithMessages > avgMoodWithoutMessages) {
        insights.push('Community interaction correlates with better mood');
      }
    }

    // Detect worst mood weekday
    if (summariesWithMood.length > 0) {
      const moodByDayOfWeek = new Map<number, number[]>();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      summariesWithMood.forEach(s => {
        if (!moodByDayOfWeek.has(s.dayOfWeek)) {
          moodByDayOfWeek.set(s.dayOfWeek, []);
        }
        moodByDayOfWeek.get(s.dayOfWeek)!.push(s.mood!);
      });

      let lowestAvgMood = Infinity;
      let lowestDay = -1;

      moodByDayOfWeek.forEach((moods, day) => {
        const avgMood = moods.reduce((sum, m) => sum + m, 0) / moods.length;
        if (avgMood < lowestAvgMood) {
          lowestAvgMood = avgMood;
          lowestDay = day;
        }
      });

      if (lowestDay !== -1 && lowestDay >= 0 && lowestDay < dayNames.length) {
        const dayName = dayNames[lowestDay];
        insights.push(`Your mood tends to dip on ${dayName}s`);
      }
    }

    // Return insights or message if none found
    if (insights.length === 0) {
      insights.push('No clear mood patterns detected');
    }

    return { insights };
  } catch (error) {
    console.error('[AnalyticsService] Error analyzing mood patterns:', error);
    throw error;
  }
}

/**
 * Predict user's mood for the next day based on historical patterns
 * Analyzes mood, journaling, and messaging activity from last 30 days
 * @param userId - User ID to predict mood for
 * @returns Predicted mood score (1-10) or null if insufficient data
 */
async function predictUserMood(userId: string): Promise<MoodPredictionResult> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    // Fetch relevant events for the user in the last 30 days
    const events = await Event.find({
      userId,
      eventType: { $in: ['mood_logged', 'journal_created', 'message_sent'] },
      createdAt: { $gte: cutoffDate }
    }).sort({ createdAt: 1 });

    if (events.length === 0) {
      return {
        predictedMood: null,
        message: 'Not enough data for prediction'
      };
    }

    // Build daily summary: {date, mood, journalCount, messageCount}
    const dailySummary = new Map<string, { mood: number | null; journalCount: number; messageCount: number }>();

    events.forEach(event => {
      const dateKey = event.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!dailySummary.has(dateKey)) {
        dailySummary.set(dateKey, {
          mood: null,
          journalCount: 0,
          messageCount: 0
        });
      }

      const day = dailySummary.get(dateKey)!;

      if (event.eventType === 'mood_logged') {
        // Extract mood score from metadata
        day.mood = event.metadata?.mood || event.metadata?.moodScore || null;
      } else if (event.eventType === 'journal_created') {
        day.journalCount += 1;
      } else if (event.eventType === 'message_sent') {
        day.messageCount += 1;
      }
    });

    // Calculate averages
    const summaries = Array.from(dailySummary.values());
    const moods = summaries.filter(s => s.mood !== null).map(s => s.mood as number);

    if (moods.length < 5) {
      return {
        predictedMood: null,
        message: 'Not enough data for prediction'
      };
    }

    const avgMood = moods.reduce((sum, m) => sum + m, 0) / moods.length;
    const avgJournal = summaries.reduce((sum, s) => sum + s.journalCount, 0) / summaries.length;
    const avgMessages = summaries.reduce((sum, s) => sum + s.messageCount, 0) / summaries.length;

    // Prediction formula:
    // predictedMood = avgMood * (avgJournal * 0.2) * (avgMessages * 0.05)
    let predictedMood = avgMood * (avgJournal * 0.2) * (avgMessages * 0.05);

    // Clamp between 1 and 10
    predictedMood = Math.max(1, Math.min(10, predictedMood));

    // Round to 1 decimal place
    predictedMood = Math.round(predictedMood * 10) / 10;

    return {
      predictedMood
    };
  } catch (error) {
    console.error('[AnalyticsService] Error predicting user mood:', error);
    throw error;
  }
}

export { getDailyActiveUsers, getFeatureUsage, getChatEngagement, getUserRetention, getUserActivityHeatmap, analyzeMoodPatterns, predictUserMood };

