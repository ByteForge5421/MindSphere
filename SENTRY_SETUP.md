# Sentry Error Monitoring Setup

This document explains how to configure Sentry error monitoring for MindSphere.

## Overview

Sentry is integrated into both the frontend (React) and backend (Express) to capture runtime errors and performance issues in production.

## Frontend Setup

### Configuration

The frontend Sentry initialization is located in `src/lib/sentry.ts` and is imported in `main.tsx`.

To enable Sentry monitoring on the frontend, add the Sentry DSN to your environment variables:

**For development:**
```bash
# .env.local or .env.development.local
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**For production:**
```bash
# .env.production
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Features

- **Error Tracking**: Captures all unhandled JavaScript errors
- **Session Replay**: Records user sessions when errors occur (controlled via `replaysOnErrorSampleRate`)
- **Performance Monitoring**: Tracks page load times and transactions
- **Environment-specific configuration**: Automatically set based on Vite's `MODE` variable

### Running Locally

If you don't have a Sentry project, the frontend will gracefully skip initialization if `VITE_SENTRY_DSN` is not set.

```bash
npm run dev
# Sentry will be disabled unless VITE_SENTRY_DSN is configured
```

## Backend Setup

### Configuration

The backend Sentry initialization is in `server.js` and automatically runs on startup.

To enable Sentry monitoring on the backend, add the Sentry DSN to your environment variables:

```bash
# .env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NODE_ENV=production
```

### Features

- **Error Tracking**: Captures all unhandled exceptions in Express routes
- **Request Tracking**: Records request context for better error diagnosis
- **Middleware Integration**: 
  - Request handler is added early in middleware chain
  - Error handler is added after routes and before custom error handlers
- **Environment-specific configuration**: Automatically set based on `NODE_ENV`

### Running Locally

If you don't have a Sentry project, the backend will gracefully skip Sentry middleware if `SENTRY_DSN` is not set.

```bash
npm start
# Sentry will be disabled unless SENTRY_DSN is configured
```

## Setting Up a Sentry Project

1. **Create a Sentry account**: Visit [sentry.io](https://sentry.io/)
2. **Create a new project**:
   - For Frontend: Select "React" as the platform
   - For Backend: Select "Node.js" as the platform
3. **Copy the DSN**: Found in Project Settings > Client Keys (DSN)
4. **Configure environment variables** as shown above

## Error Boundary (Optional)

For React, you can optionally add an error boundary component to catch React component errors:

```tsx
import * as Sentry from "@sentry/react";

const ErrorBoundary = Sentry.withErrorBoundary(YourComponent, {
  fallback: <div>An error occurred</div>,
  showDialog: true,
});
```

## Performance Monitoring

Both frontend and backend are configured with `tracesSampleRate: 1.0`, which means 100% of transactions are sampled for performance monitoring. In production, you may want to reduce this to `0.1` or `0.01` to save bandwidth:

```ts
// Frontend (src/lib/sentry.ts)
tracesSampleRate: 0.1, // Sample 10% of transactions

// Backend (server.js)
tracesSampleRate: 0.1, // Sample 10% of transactions
```

## Monitoring Dashboard

Once configured and errors occur, you can view them on the Sentry dashboard:
- Error frequency and trends
- Stack traces with source maps (if configured)
- User session replays (frontend only)
- Performance metrics and slow transactions
- Alert rules for critical issues

## Disabling Sentry

To disable Sentry:
- **Frontend**: Remove or comment out `VITE_SENTRY_DSN` from environment variables
- **Backend**: Remove or comment out `SENTRY_DSN` from environment variables

The application will continue to work normally, just without error monitoring.

## Troubleshooting

**Frontend errors not appearing:**
- Ensure `VITE_SENTRY_DSN` is set correctly
- Check browser console for Sentry initialization logs
- Verify the Sentry project exists and is active

**Backend errors not appearing:**
- Ensure `SENTRY_DSN` is set in `.env`
- Check server logs for Sentry initialization messages
- Verify network connectivity to Sentry servers in production environment

## Security Considerations

- Never commit DSN values to version control
- Use environment variables or secrets management (GitHub Secrets, AWS Secrets Manager, etc.)
- In production, use separate Sentry projects for different environments (dev, staging, prod)
- Configure data scrubbing in Sentry to remove sensitive information
