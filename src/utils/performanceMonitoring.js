import { logAnalyticsEvent } from './analyticsService';

/**
 * Monitor and log performance metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
  }

  /**
   * Start timing an operation
   * @param {string} operationName
   */
  start(operationName) {
    this.marks.set(operationName, performance.now());
  }

  /**
   * End timing and log to analytics
   * @param {string} operationName
   * @param {object} additionalParams
   */
  end(operationName, additionalParams = {}) {
    const startTime = this.marks.get(operationName);
    if (!startTime) {
      console.warn(`No start mark found for ${operationName}`);
      return;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(operationName);

    logAnalyticsEvent('performance_metric', {
      operation: operationName,
      duration_ms: Math.round(duration),
      ...additionalParams,
    });

    return duration;
  }

  /**
   * Log Web Vitals metrics
   */
  static logWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logAnalyticsEvent('web_vitals', {
          metric: 'LCP',
          value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          logAnalyticsEvent('web_vitals', {
            metric: 'FID',
            value: Math.round(entry.processingStart - entry.startTime),
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        logAnalyticsEvent('web_vitals', {
          metric: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
