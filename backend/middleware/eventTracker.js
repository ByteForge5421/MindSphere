/**
 * Event tracker middleware
 */

function trackEventMiddleware(eventName) {
  return (req, res, next) => {
    // TODO: Implement event tracking middleware
    console.log(`Event: ${eventName}`);
    next();
  };
}

module.exports = {
  trackEventMiddleware
};
