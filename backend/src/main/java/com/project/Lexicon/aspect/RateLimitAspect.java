package com.project.Lexicon.aspect;

import com.project.Lexicon.annotations.RateLimit;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Aspect
@Component
@Slf4j
public class RateLimitAspect {

    private final Map<String, BucketWrapper> buckets = new ConcurrentHashMap<>();

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Value("${rate.limit.enabled:true}")
    private boolean rateLimitEnabled;

    // Wrapper class to track last access time for cleanup
    private static class BucketWrapper {
        final Bucket bucket;
        volatile long lastAccessTime;

        BucketWrapper(Bucket bucket) {
            this.bucket = bucket;
            this.lastAccessTime = System.currentTimeMillis();
        }

        void updateAccessTime() {
            this.lastAccessTime = System.currentTimeMillis();
        }
    }

    @Around("@annotation(rateLimit)")
    public Object handleRateLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        // Allow bypass if rate limiting is disabled
        if (!rateLimitEnabled) {
            log.debug("Rate limiting is disabled");
            return joinPoint.proceed();
        }

        String clientIp = getClientIp();
        String key = rateLimit.key() + ":" + clientIp;

        BucketWrapper wrapper = buckets.computeIfAbsent(key, k -> new BucketWrapper(createBucket(rateLimit)));
        wrapper.updateAccessTime();

        if (wrapper.bucket.tryConsume(1)) {
            log.debug("Rate limit check passed for key: {} from IP: {}", rateLimit.key(), clientIp);
            return joinPoint.proceed();
        } else {
            long availableTokens = wrapper.bucket.getAvailableTokens();
            log.warn("Rate limit exceeded for key: {} from IP: {} (available tokens: {})", 
                    rateLimit.key(), clientIp, availableTokens);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of(
                            "error", "Rate limit exceeded. Please try again later.",
                            "limit", rateLimit.limit(),
                            "window", rateLimit.duration() + " seconds"
                    ));
        }
    }

    private Bucket createBucket(RateLimit rateLimit) {
        Bandwidth limit = Bandwidth.classic(rateLimit.limit(),
                Refill.intervally(rateLimit.limit(), Duration.ofSeconds(rateLimit.duration())));
        return Bucket4j.builder().addLimit(limit).build();
    }

    // Clean up old buckets every 10 minutes to prevent memory leaks
    @Scheduled(fixedRate = 600000) // 10 minutes
    public void cleanupOldBuckets() {
        long now = System.currentTimeMillis();
        long maxAge = 3600000; // 1 hour
        
        int removedCount = 0;
        for (Map.Entry<String, BucketWrapper> entry : buckets.entrySet()) {
            if (now - entry.getValue().lastAccessTime > maxAge) {
                buckets.remove(entry.getKey());
                removedCount++;
            }
        }
        
        if (removedCount > 0) {
            log.info("Cleaned up {} old rate limit buckets. Current bucket count: {}", 
                    removedCount, buckets.size());
        }
    }

    private String getClientIp() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}
