import { HelixJs } from '@helix/db';

interface Event {
    queryName: string;
    queryContent: string;
}

export default function handler(event: Event) {
    const startTime = process.hrtime();
    let uniqueNumberId = Date.now() + Math.floor(Math.random() * 1000);
    try {
        const helix = new HelixJs(`user${uniqueNumberId}`);
        const initTime = process.hrtime(startTime);

        const queryStartTime = process.hrtime();
        const res = helix.query(event.queryContent, []);
        const queryTime = process.hrtime(queryStartTime);
        return {
            success: true,
            result: JSON.parse(res),
            queryName: event.queryName,
            initTime: `${initTime[0]}s ${initTime[1] / 1000000}ms`,
            queryTime: `${queryTime[0]}s ${queryTime[1] / 1000000}ms`,
            timestamp: new Date().toISOString
        }

    } catch (error) {
        console.error("Error:", error);
    }
}
