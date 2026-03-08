import axios from 'axios';

/**
 * Get Daily Active Users statistics
 * @param days - Number of days to analyze (default: 30)
 * @returns Analytics data with daily active user counts
 */
export const getDailyActiveUsers = async (days: number = 30) => {
  try {
    const res = await axios.get(`/api/analytics/dau?days=${days}`);
    return res.data;
  } catch (error) {
    console.error('[AnalyticsService] Error fetching DAU:', error);
    throw error;
  }
};

/**
 * Get Feature Usage statistics
 * @param days - Number of days to analyze (default: 30)
 * @returns Analytics data with feature usage counts (mood_logged, journal_created, message_sent, community_joined)
 */
export const getFeatureUsage = async (days: number = 30) => {
  try {
    const res = await axios.get(`/api/analytics/features?days=${days}`);
    return res.data;
  } catch (error) {
    console.error('[AnalyticsService] Error fetching feature usage:', error);
    throw error;
  }
};

/**
 * Get Chat Engagement statistics
 * @param days - Number of days to analyze (default: 30)
 * @returns Analytics data with chat metrics (totalMessages, avgMessageLength, uniqueUsers, messagesPerUser)
 */
export const getChatEngagement = async (days: number = 30) => {
  try {
    const res = await axios.get(`/api/analytics/chat?days=${days}`);
    return res.data;
  } catch (error) {
    console.error('[AnalyticsService] Error fetching chat engagement:', error);
    throw error;
  }
};

/**
 * Get User Retention statistics
 * @returns Analytics data with retention metrics (totalUsers, day1Retention, day7Retention, day30Retention)
 */
export const getUserRetention = async () => {
  try {
    const res = await axios.get('/api/analytics/retention');
    return res.data;
  } catch (error) {
    console.error('[AnalyticsService] Error fetching user retention:', error);
    throw error;
  }
};

/**
 * Get User Activity Heatmap statistics
 * @param days - Number of days to analyze (default: 30)
 * @returns Analytics data with activity counts grouped by day of week and hour of day
 */
export const getUserActivityHeatmap = async (days: number = 30) => {
  try {
    const res = await axios.get(`/api/analytics/heatmap?days=${days}`);
    return res.data;
  } catch (error) {
    console.error('[AnalyticsService] Error fetching user activity heatmap:', error);
    throw error;
  }
};

/**
 * Get AI-generated mood insights for the authenticated user
 * @returns Analytics data with behavioral insights about mood patterns
 */
export const getMoodInsights = async () => {
  try {
    const res = await axios.get('/api/analytics/mood-insights');
    return res.data;
  } catch (error) {
    console.error('[AnalyticsService] Error fetching mood insights:', error);
    throw error;
  }
};

/**
 * Get predicted mood for the next day based on historical patterns
 * @returns Analytics data with mood prediction score (1-10) or null if insufficient data
 */
export const getMoodPrediction = async () => {
  try {
    const res = await axios.get('/api/analytics/mood-prediction');
    return res.data;
  } catch (error) {
    console.error('[AnalyticsService] Error fetching mood prediction:', error);
    throw error;
  }
};
