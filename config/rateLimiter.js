import { RateLimiterMemory } from "rate-limiter-flexible";

export const rateLimiter = new RateLimiterMemory({
    points: 120, // 120 requests per minute
    duration: 60 // per 60 sec
});