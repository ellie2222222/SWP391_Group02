const { createClient } = require("redis");
const hash = require("object-hash");
const zlib = require("zlib");

let redisClient;

async function initializeRedisClient() {
    try {
        let redisURI = process.env.REDIS_URI || "redis://localhost:6379"
        if (redisURI) {
            // create the Redis client object
            redisClient = createClient({
                password: process.env.REDIS_CLIENT_PASSWORD,
                socket: {
                    host: process.env.REDIS_CLIENT_SOCKET_HOST,
                    port: process.env.REDIS_CLIENT_SOCKET_PORT,
                }
            })
                .on("error", (e) => {
                    console.error(`Failed to create the Redis client with error:`);
                    console.error(e);
                });

            await redisClient.connect();
            console.log(`Connected to Redis successfully!`);
        }
    } catch (e) {
        console.error(`Connection to Redis failed with error:`);
        console.error(e);
    }
}

function requestToKey(req) {
    const reqDataToHash = req.baseUrl + req.path;
    return `${req.baseUrl + req.path}@${hash.sha1(reqDataToHash)}`;
}

function isRedisWorking() {
    return redisClient && redisClient.isOpen;
}

async function writeData(key, data, options = {}, compress = false) {
    if (isRedisWorking()) {
        try {
            let dataToCache = compress ? zlib.deflateSync(data).toString("base64") : data;
            await redisClient.set(key, dataToCache, options);
        } catch (e) {
            console.error(`Failed to cache data for key=${key}:`, e);
        }
    } else {
        console.warn("Redis is not available, skipping caching.");
    }
}

async function readData(key, compressed = false) {
    if (isRedisWorking()) {
        try {
            const cachedValue = await redisClient.get(key);
            if (cachedValue) {
                return compressed
                    ? zlib.inflateSync(Buffer.from(cachedValue, "base64")).toString()
                    : cachedValue;
            }
        } catch (e) {
            console.error(`Failed to read data for key=${key}:`, e);
        }
    } else {
        console.warn("Redis is not available, skipping cache retrieval.");
    }
    return null;
}

async function invalidateCachedData(req, res, next) {
    const key = requestToKey(req);
    if (isRedisWorking()) {
        try {
            await redisClient.del(key);
            console.log(`Cache invalidated for key=${key}`);
        } catch (e) {
            console.error(`Failed to invalidate cache for key=${key}:`, e);
        }
    }
    next();
}

function redisCacheMiddleware(options = { EX: 21600 }, compression = false) {
    return async (req, res, next) => {
        if (isRedisWorking()) {
            const key = requestToKey(req);
            try {
                const cachedValue = await readData(key, compression);
                if (cachedValue) {
                    console.log(`Cache hit for key=${key}`);
                    try {
                        return res.json(JSON.parse(cachedValue));
                    } catch {
                        return res.send(cachedValue);
                    }
                } else {
                    console.log(`Cache miss for key=${key}, fetching data from the database.`);
                    const oldSend = res.send;
                    res.send = function (data) {
                        res.send = oldSend;
                        if (res.statusCode.toString().startsWith("2")) {
                            writeData(key, data, options, compression).then();
                        }
                        return res.send(data);
                    };
                    next();
                }
            } catch (e) {
                console.error(`Cache middleware error for key=${key}:`, e);
                next(); // Proceed without cache if there's an error
            }
        } else {
            console.warn("Redis is not available, skipping caching.");
            next();
        }
    };
}

module.exports = {
    initializeRedisClient,
    redisCacheMiddleware,
    invalidateCachedData,
};
