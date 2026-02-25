const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

interface CachedItem<T> {
  data: T;
  expiry: number;
}

export function setCache<T>(key: string, data: T, ttl = DEFAULT_TTL) {
  const item: CachedItem<T> = { data, expiry: Date.now() + ttl };
  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  } catch {
    // storage full — ignore
  }
}

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`cache_${key}`);
    if (!raw) return null;
    const item: CachedItem<T> = JSON.parse(raw);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    return item.data;
  } catch {
    return null;
  }
}

export function clearAllCache() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("cache_"));
  keys.forEach((k) => localStorage.removeItem(k));
}
