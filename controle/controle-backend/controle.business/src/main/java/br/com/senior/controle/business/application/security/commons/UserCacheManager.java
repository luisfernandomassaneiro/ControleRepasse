package br.com.senior.controle.business.application.security.commons;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class UserCacheManager {

    public static final String USER_KEY = "user-resources";

    private final CacheManager cacheManager;

    public UserCacheManager(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public void clear(Long id) {
        Cache c = cacheManager.getCache(USER_KEY);
        if (c != null) {
            c.evict(id);
        }
    }
}
