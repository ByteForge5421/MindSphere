import Event from '../models/Event';

/**
 * Track an analytics event for a user
 * @param userId - The ID of the user performing the action
 * @param eventType - The type of event (e.g., "message_sent", "group_joined")
 * @param metadata - Additional event metadata
 * 
 * Example usage:
 * await trackEvent(userId, "message_sent", {
 *   communityId,
 *   messageLength
 * });
 */
async function trackEvent(
  userId: string,
  eventType: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    await Event.create({
      userId,
      eventType,
      metadata
    });
  } catch (error) {
    // Log the error but don't throw
    // Analytics should never break the main app flow
    console.error('[EventService] Failed to track event:', {
      userId,
      eventType,
      error
    });
  }
}

export { trackEvent };
