package com.unisystem.academic_core_service.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.cache.interceptor.SimpleCacheErrorHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.annotation.CachingConfigurer;

@Slf4j
@Configuration
@EnableCaching
public class CachingConfig implements CachingConfigurer {

    @Override
    public CacheErrorHandler errorHandler() {
        return new SimpleCacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException e, Cache cache, Object key) {
                log.warn("Cache GET error on cache '{}', key '{}'. Evicting and continuing. Error: {}",
                        cache.getName(), key, e.getMessage());
                try {
                    cache.evict(key); // remove the bad entry
                } catch (Exception evictEx) {
                    log.error("Failed to evict cache key: {}", key, evictEx);
                }
                // Don't rethrow — app continues as if cache missed
            }

            @Override
            public void handleCachePutError(RuntimeException e, Cache cache, Object key, Object value) {
                log.error("Cache PUT error on cache '{}', key '{}'", cache.getName(), key, e);
            }

            @Override
            public void handleCacheEvictError(RuntimeException e, Cache cache, Object key) {
                log.error("Cache EVICT error on cache '{}', key '{}'", cache.getName(), key, e);
            }
        };
    }
}
