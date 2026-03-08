import express, { Router, Request, Response } from 'express';
import { getDailyActiveUsers, getFeatureUsage, getChatEngagement, getUserRetention, getUserActivityHeatmap, analyzeMoodPatterns, predictUserMood } from '../services/analyticsService';
import auth from '../middleware/auth';

const router: Router = express.Router();

/**
 * @route   GET /analytics/dau
 * @desc    Get Daily Active Users for the last N days
 * @access  Private (requires authentication)
 * @query   days - Number of days to analyze (default: 30)
 */
router.get('/dau', auth, async (req: Request, res: Response) => {
  try {
    // Get days from query parameter, default to 30
    const days = parseInt(req.query.days as string) || 30;

    // Validate days parameter
    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days parameter must be between 1 and 365'
      });
    }

    // Get daily active users data
    const data = await getDailyActiveUsers(days);

    // Return success response
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Analytics Route] Error fetching DAU:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

/**
 * @route   GET /analytics/features
 * @desc    Get feature usage statistics for the last N days
 * @access  Private (requires authentication)
 * @query   days - Number of days to analyze (default: 30)
 */
router.get('/features', auth, async (req: Request, res: Response) => {
  try {
    // Get days from query parameter, default to 30
    const days = parseInt(req.query.days as string) || 30;

    // Validate days parameter
    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days parameter must be between 1 and 365'
      });
    }

    // Get feature usage data
    const data = await getFeatureUsage(days);

    // Return success response
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Analytics Route] Error fetching feature usage:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

/**
 * @route   GET /analytics/chat
 * @desc    Get chat engagement statistics for the last N days
 * @access  Private (requires authentication)
 * @query   days - Number of days to analyze (default: 30)
 */
router.get('/chat', auth, async (req: Request, res: Response) => {
  try {
    // Get days from query parameter, default to 30
    const days = parseInt(req.query.days as string) || 30;

    // Validate days parameter
    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days parameter must be between 1 and 365'
      });
    }

    // Get chat engagement data
    const data = await getChatEngagement(days);

    // Return success response
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Analytics Route] Error fetching chat engagement:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

/**
 * @route   GET /analytics/retention
 * @desc    Get user retention metrics (Day-1, Day-7, Day-30)
 * @access  Private (requires authentication)
 */
router.get('/retention', auth, async (req: Request, res: Response) => {
  try {
    // Get user retention data
    const data = await getUserRetention();

    // Return success response
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Analytics Route] Error fetching user retention:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

/**
 * @route   GET /analytics/heatmap
 * @desc    Get user activity heatmap by day of week and hour of day
 * @access  Private (requires authentication)
 * @query   days - Number of days to analyze (default: 30)
 */
router.get('/heatmap', auth, async (req: Request, res: Response) => {
  try {
    // Get days from query parameter, default to 30
    const days = parseInt(req.query.days as string) || 30;

    // Validate days parameter
    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days parameter must be between 1 and 365'
      });
    }

    // Get user activity heatmap data
    const data = await getUserActivityHeatmap(days);

    // Return success response
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Analytics Route] Error fetching activity heatmap:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

/**
 * @route   GET /analytics/mood-insights
 * @desc    Get AI-generated mood insights for the authenticated user
 * @access  Private (requires authentication)
 */
router.get('/mood-insights', auth, async (req: Request, res: Response) => {
  try {
    // Get authenticated user ID
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Analyze mood patterns for the user
    const data = await analyzeMoodPatterns(userId);

    // Return success response
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Analytics Route] Error analyzing mood patterns:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

/**
 * @route   GET /analytics/mood-prediction
 * @desc    Predict user's mood for the next day based on historical patterns
 * @access  Private (requires authentication)
 */
router.get('/mood-prediction', auth, async (req: Request, res: Response) => {
  try {
    // Get authenticated user ID
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Predict user's mood
    const data = await predictUserMood(userId);

    // Return success response
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[Analytics Route] Error predicting user mood:', error);
    res.status(500).json({
      success: false,
      message: 'Error predicting mood'
    });
  }
});

export default router;
