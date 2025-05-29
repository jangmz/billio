import { rateLimiter } from "./rateLimiter";
import { getUserIP } from "./retrieveIp";

export async function checkRateLimit(req) {
    const ip = await getUserIP();

    try {
        await rateLimiter.consume(ip);
        return { allowed: true };
    } catch (error) {
        return { allowed: false };
    }
}