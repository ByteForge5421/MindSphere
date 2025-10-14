import { Request, Response, NextFunction } from 'express';
import { trackEvent } from '../services/eventService';

/**
 * Event tracking middleware factory
 * Creates a middleware that automatically tracks user actions
 * @param eventType - The type of event to track (e.g., 'journal_created', 'mood_logged')
 * @returns Middleware function that tracks the event and calls next()
 */
export const trackEventMiddleware = (eventType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract userId from authenticated request
      const userId = (req as any).user?.id;

      // Only track if user is authenticated
      if (userId) {
        // Track the event (non-blocking - don't await for response time concerns)
        trackEvent(userId, eventType).catch((error) => {
          console.error(`[EventTracker] Failed to track event '${eventType}' for user ${userId}:`, error);
        });
      }
    } catch (error) {
      // Log error but do not block the request
      console.error(`[EventTracker] Error in event tracking middleware:`, error);
    }

    // Continue to next middleware/route handler
    next();
  };
};
