const { createClient } = require("redis");
const hash = require("object-hash");
const zlib = require("zlib");

let redisClient = undefined;

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
    const reqDataToHash = {
        query: req.query,
        body: req.body,
    };
    
    return `${req.baseUrl + req.path}@${hash.sha1(reqDataToHash)}`;
}

function isRedisWorking() {
    return !!redisClient?.isOpen;
}

async function writeData(key, data, options, compress) {
    if (isRedisWorking()) {
        let dataToCache = data;
        try {
            if (compress) {
                dataToCache = zlib.deflateSync(data).toString("base64");
            }


            await redisClient.set(key, dataToCache, options);
        } catch (e) {
            console.error(`Failed to cache data for key=${key}`, e);
        }
    }
}

async function readData(key, compressed) {
    let cachedValue = undefined;
    if (isRedisWorking()) {
        try {
            cachedValue = await redisClient.get(key);
            if (cachedValue) {
                if (compressed) {
                    return zlib.inflateSync(Buffer.from(cachedValue, "base64")).toString();
                } else {
                    return cachedValue;
                }
            }
        } catch (e) {
            console.error(`Failed to read data for key=${key}`, e);
        }
    }

    return cachedValue;
}

function redisCacheMiddleware(
    options = {
        EX: 21600, // 6h
    },
    compression = true
) {
    return async (req, res, next) => {
        if (isRedisWorking()) {
            const key = requestToKey(req);
            const cachedValue = await readData(key, compression);
            if (cachedValue) {
                try {
                    return res.json(JSON.parse(cachedValue));
                } catch {
                    return res.send(cachedValue);
                }
            } else {
                // override how res.send behaves to introduce the caching logic
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
        } else {
            next();
        }
    };
}

module.exports = {
    initializeRedisClient,
    redisCacheMiddleware,
};