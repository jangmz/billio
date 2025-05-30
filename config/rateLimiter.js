import { RateLimiterMemory } from "rate-limiter-flexible";

export const rateLimiter = new RateLimiterMemory({
    points: 60, // 60 requests per minute
    duration: 60 // per 60 sec
});