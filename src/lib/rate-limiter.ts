// SEO Maskinen - Simple and robust rate limiting
// Tracks successful analyses (10/day) and failures (40/day) separately

interface DailyUsage {
  date: string;
  successes: number;
  failures: number;
}

const STORAGE_KEY = 'seo_maskinen_usage';
const DAILY_SUCCESS_LIMIT = 5;
const DAILY_FAILURE_LIMIT = 40;

// Get today's date key
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

// Calculate time until midnight
function getTimeUntilReset(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes} minuter`;
  }
  return `${hours}h ${minutes}min`;
}

// Load or initialize usage data
function loadUsage(): DailyUsage {
  if (typeof window === 'undefined') {
    return { date: getTodayKey(), successes: 0, failures: 0 };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { date: getTodayKey(), successes: 0, failures: 0 };
    }

    const usage: DailyUsage = JSON.parse(stored);
    const today = getTodayKey();

    // Reset if it's a new day
    if (usage.date !== today) {
      const newUsage = { date: today, successes: 0, failures: 0 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
      return newUsage;
    }

    return usage;
  } catch {
    return { date: getTodayKey(), successes: 0, failures: 0 };
  }
}

// Save usage data
function saveUsage(usage: DailyUsage): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // Ignore localStorage errors
  }
}

// Check if user can make a request
export function canMakeRequest(): { 
  allowed: boolean; 
  reason?: string; 
  remainingSuccesses: number;
  timeUntilReset: string;
} {
  const usage = loadUsage();
  const timeUntilReset = getTimeUntilReset();

  // Check failure limit first (more serious)
  if (usage.failures >= DAILY_FAILURE_LIMIT) {
    return {
      allowed: false,
      reason: 'failure_limit',
      remainingSuccesses: Math.max(0, DAILY_SUCCESS_LIMIT - usage.successes),
      timeUntilReset
    };
  }

  // Check success limit
  if (usage.successes >= DAILY_SUCCESS_LIMIT) {
    return {
      allowed: false,
      reason: 'success_limit',
      remainingSuccesses: 0,
      timeUntilReset
    };
  }

  return {
    allowed: true,
    remainingSuccesses: DAILY_SUCCESS_LIMIT - usage.successes,
    timeUntilReset
  };
}

// Record a successful analysis
export function recordSuccess(): void {
  const usage = loadUsage();
  usage.successes++;
  saveUsage(usage);
}

// Record a failed analysis
export function recordFailure(): void {
  const usage = loadUsage();
  usage.failures++;
  saveUsage(usage);
}

// Get current usage stats (for UI display)
export function getUsageStats(): {
  successes: number;
  failures: number;
  remainingSuccesses: number;
  timeUntilReset: string;
  isSuccessLimitReached: boolean;
  isFailureLimitReached: boolean;
} {
  const usage = loadUsage();
  const timeUntilReset = getTimeUntilReset();

  return {
    successes: usage.successes,
    failures: usage.failures,
    remainingSuccesses: Math.max(0, DAILY_SUCCESS_LIMIT - usage.successes),
    timeUntilReset,
    isSuccessLimitReached: usage.successes >= DAILY_SUCCESS_LIMIT,
    isFailureLimitReached: usage.failures >= DAILY_FAILURE_LIMIT
  };
}
