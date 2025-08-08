import { PERFORMANCE_LIMITS } from '@/lib/constants';

// ========================
// Timeout Coordination
// ========================

export interface TimeoutConfig {
  totalTimeout: number;      // Total time allowed for entire request
  crawlerTimeout: number;    // Time allowed for crawler
  openaiTimeout: number;     // Time allowed for OpenAI
  bufferTime: number;        // Buffer time for database operations
}

export interface ServiceTimeouts {
  crawler: number;
  openai: number;
  total: number;
}

/**
 * Calculate optimal timeouts based on service requirements
 * Ensures crawler + openai + buffer < total timeout
 */
export function calculateServiceTimeouts(): ServiceTimeouts {
  const bufferTime = 10_000; // 10 seconds for auth, DB ops, etc.
  const totalTimeout = 120_000; // 2 minutes total request timeout
  
  // Current limits from constants
  const crawlerTimeout = PERFORMANCE_LIMITS.CRAWL_TIMEOUT; // 90s
  const openaiTimeout = PERFORMANCE_LIMITS.OPENAI_TIMEOUT; // 30s
  
  // Check if current limits fit within total timeout
  const requiredTime = crawlerTimeout + openaiTimeout + bufferTime;
  
  if (requiredTime > totalTimeout) {
    // Need to reduce timeouts proportionally
    const availableTime = totalTimeout - bufferTime;
    const ratio = availableTime / (crawlerTimeout + openaiTimeout);
    
    return {
      crawler: Math.floor(crawlerTimeout * ratio),
      openai: Math.floor(openaiTimeout * ratio),
      total: totalTimeout,
    };
  }
  
  return {
    crawler: crawlerTimeout,
    openai: openaiTimeout, 
    total: totalTimeout,
  };
}

/**
 * Create a coordinated timeout controller for the entire analysis pipeline
 */
export class AnalysisTimeoutController {
  private readonly config: ServiceTimeouts;
  private readonly startTime: number;
  private readonly abortController: AbortController;
  
  constructor() {
    this.config = calculateServiceTimeouts();
    this.startTime = Date.now();
    this.abortController = new AbortController();
    
    // Set up total timeout
    setTimeout(() => {
      this.abort('Total timeout exceeded');
    }, this.config.total);
  }
  
  /**
   * Get remaining time for a specific service
   */
  getRemainingTime(service: 'crawler' | 'openai'): number {
    const elapsed = Date.now() - this.startTime;
    const serviceTimeout = this.config[service];
    return Math.max(0, serviceTimeout - elapsed);
  }
  
  /**
   * Check if there's enough time left for a service
   */
  hasTimeFor(service: 'crawler' | 'openai', minimumSeconds: number = 5): boolean {
    const remaining = this.getRemainingTime(service);
    return remaining >= (minimumSeconds * 1000);
  }
  
  /**
   * Get abort signal for timeout coordination
   */
  get signal(): AbortSignal {
    return this.abortController.signal;
  }
  
  /**
   * Manually abort with reason
   */
  abort(reason: string): void {
    if (!this.abortController.signal.aborted) {
      console.warn(`Analysis aborted: ${reason}`);
      this.abortController.abort();
    }
  }
  
  /**
   * Get configuration for logging/debugging
   */
  getConfig(): ServiceTimeouts & { elapsed: number } {
    return {
      ...this.config,
      elapsed: Date.now() - this.startTime,
    };
  }
}

/**
 * Circuit breaker for external services
 */
export class ServiceCircuitBreaker {
  private failures: Map<string, number> = new Map();
  private lastFailure: Map<string, number> = new Map();
  private readonly maxFailures = 3;
  private readonly resetTimeMs = 60_000; // 1 minute
  
  /**
   * Check if service is available (not circuit broken)
   */
  isAvailable(service: string): boolean {
    const failures = this.failures.get(service) ?? 0;
    const lastFailure = this.lastFailure.get(service) ?? 0;
    
    if (failures < this.maxFailures) {
      return true;
    }
    
    // Check if reset time has passed
    const timeSinceFailure = Date.now() - lastFailure;
    if (timeSinceFailure > this.resetTimeMs) {
      this.failures.set(service, 0);
      return true;
    }
    
    return false;
  }
  
  /**
   * Record a service failure
   */
  recordFailure(service: string): void {
    const current = this.failures.get(service) ?? 0;
    this.failures.set(service, current + 1);
    this.lastFailure.set(service, Date.now());
  }
  
  /**
   * Record a service success (reset failure count)
   */
  recordSuccess(service: string): void {
    this.failures.set(service, 0);
  }
  
  /**
   * Get status for monitoring
   */
  getStatus(service: string): { failures: number; available: boolean; nextRetry?: number } {
    const failures = this.failures.get(service) ?? 0;
    const available = this.isAvailable(service);
    const lastFailure = this.lastFailure.get(service);
    
    return {
      failures,
      available,
      nextRetry: lastFailure && !available 
        ? lastFailure + this.resetTimeMs 
        : undefined,
    };
  }
}

// Global circuit breaker instance
export const circuitBreaker = new ServiceCircuitBreaker();

/**
 * Wrapper for external service calls with timeout and circuit breaker
 */
export async function withServiceProtection<T>(
  serviceName: string,
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number
): Promise<T> {
  // Check circuit breaker
  if (!circuitBreaker.isAvailable(serviceName)) {
    const status = circuitBreaker.getStatus(serviceName);
    const nextRetry = status.nextRetry ? new Date(status.nextRetry).toLocaleTimeString() : 'unknown';
    throw new Error(`Service ${serviceName} is currently unavailable. Try again at ${nextRetry}.`);
  }
  
  // Create timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  try {
    const result = await operation(controller.signal);
    circuitBreaker.recordSuccess(serviceName);
    return result;
  } catch (error) {
    circuitBreaker.recordFailure(serviceName);
    
    if (controller.signal.aborted) {
      throw new Error(`Service ${serviceName} timed out after ${timeoutMs}ms`);
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
