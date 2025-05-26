const CACHE_KEY = 'github_stars_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheData {
    stars: number;
    timestamp: number;
}

export function formatNumber(num: number): string {
    if (num < 1000) return num.toString();

    const thousands = num / 1000;
    // Round to nearest tenth
    const rounded = Math.round(thousands * 10) / 10;
    return `${rounded}k`;
}

export async function getGithubStars(): Promise<number> {
    // Check cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        const { stars, timestamp }: CacheData = JSON.parse(cachedData);
        const now = Date.now();

        // If cache is still valid (less than 24 hours old)
        if (now - timestamp < CACHE_DURATION) {
            return stars;
        }
    }

    try {
        // Fetch fresh data from GitHub API
        const response = await fetch('https://api.github.com/repos/helixdb/helix-db');
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub stars');
        }

        const data = await response.json();
        const stars = data.stargazers_count;

        // Update cache
        const cacheData: CacheData = {
            stars,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        return stars;
    } catch (error) {
        console.error('Error fetching GitHub stars:', error);
        // If there's cached data, return it even if expired
        if (cachedData) {
            const { stars } = JSON.parse(cachedData);
            return stars;
        }
        return 0;
    }
} 