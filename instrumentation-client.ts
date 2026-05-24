import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: "https://1d2053bd7f6b49160265840e53cd7e88@o4511446378741760.ingest.us.sentry.io/4511446386540544",
  // Adds request headers and IP for users
  sendDefaultPii: true,
  // Capture 100% in dev, 10% in production
  // Adjust based on your traffic volume
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  // Enable logs to be sent to Sentry
  enableLogs: true,
});
// This export will instrument router navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;