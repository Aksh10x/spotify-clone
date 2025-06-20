import { redisClient } from '../utils/redisClient.js';

/**
 * Redis caching middleware
 * @param {string} prefix - Prefix for the cache key
 * @param {number} expireTime - TTL in seconds (default: 1800 - 30 minutes)
 */
export const cacheMiddleware = (prefix, expireTime = 1800) => {
    return async (req, res, next) => {
        if(req.method !== 'GET'){
            return next();
        }
        
        try{
            let userId = req.user?._id ? req.user._id.toString() : 'anonymous';
            let cacheKey = `${prefix}:${userId}:${req.originalUrl}`;
            
            const cachedData = await redisClient.get(cacheKey);
            
            if (cachedData) {
                console.log(`Cache hit for ${cacheKey}`);
                return res.status(200).send(JSON.parse(cachedData));
            }
            console.log(`Cache miss for ${cacheKey}`);
            
            const originalSend = res.send;
            res.send = function(data){
                try {
                    const statusCode = res.statusCode;
                    if (statusCode >= 200 && statusCode < 300) {
                        redisClient.setEx(cacheKey, expireTime, 
                            typeof data === 'string' ? data : JSON.stringify(data)
                        );
                    }
                } catch (error) {
                    console.error('Error caching response:', error);
                }
                
                return originalSend.call(this, data);
            };
            
            next();
        } catch(error){
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

/**
 * Clear cache by pattern - using keys instead of scan for reliability
 * @param {string} pattern - Pattern to match cache keys
 */
export const clearCache = (pattern) => {
    return async (req, res, next) => {
        try {
            const keys = await redisClient.keys(`${pattern}:*`);
            
            if (keys.length > 0) {
                await redisClient.del(...keys);
                console.log(`Cleared ${keys.length} keys matching pattern: ${pattern}:*`);
            }
            
            next();
        } catch (error) {
            console.error('Error clearing cache:', error);
            next();
        }
    };
};

/**
 * Clear multiple cache patterns
 * @param {Array<string>} patterns - Array of patterns to match cache keys
 */
export const clearMultipleCache = (patterns) => {
    return async (req, res, next) => {
        try {
            let allKeys = [];
            
            for (const pattern of patterns) {
                const keys = await redisClient.keys(`${pattern}:*`);
                allKeys = allKeys.concat(keys);
            }
            if (allKeys.length > 0) {
                const uniqueKeys = [...new Set(allKeys)];
                await redisClient.del(...uniqueKeys);
                console.log(`Cleared ${uniqueKeys.length} keys from patterns: ${patterns.join(', ')}`);
            }
            
            next();
        } catch (error) {
            console.error('Error clearing multiple cache patterns:', error);
            next();
        }
    };
};

export const clearAllCache = async () => {
    try {
        await redisClient.flushAll();
        console.log('Cleared all cache');
    } catch (error) {
        console.error('Error clearing all cache:', error);
    }
};

export const isRedisConnected = () => {
    return redisClient && redisClient.isOpen;
};