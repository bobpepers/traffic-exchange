const redis = require('redis');

const redisClient = redis.createClient({
  db: 3,
  enable_offline_queue: false,
});
// const redisClient = new Redis({ enableOfflineQueue: false });
const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');

redisClient.on('error', (err) => {

});

const rateLimiterIp = new RateLimiterRedis(
  {
    points: 1,
    duration: 60, // per 60 seconds
    storeClient: redisClient,
    keyPrefix: 'ip',
    execEvenly: false,
    blockDuration: 60,
    inmemoryBlockDuration: 60,
    blockOnPointsConsumed: 1,
    inmemoryBlockOnConsumed: 1,
    insuranceLimiter: new RateLimiterMemory( // It will be used only on Redis error as insurance
      {
        points: 1, // 1 is fair if you have 5 workers and 1 cluster
        duration: 60,
        execEvenly: false,
      },
    ),
  },
);

const rateLimiterUser = new RateLimiterRedis(
  {
    points: 1,
    duration: 60, // per 60 seconds
    storeClient: redisClient,
    keyPrefix: 'user',
    execEvenly: false,
    blockDuration: 60,
    inmemoryBlockDuration: 60,
    blockOnPointsConsumed: 1,
    inmemoryBlockOnConsumed: 1,
    insuranceLimiter: new RateLimiterMemory( // It will be used only on Redis error as insurance
      {
        points: 1, // 1 is fair if you have 5 workers and 1 cluster
        duration: 600,
        execEvenly: false,
      },
    ),
  },
);

const rateLimiterFaucet = new RateLimiterRedis(
  {
    points: 1,
    duration: 600, // per 600 seconds
    storeClient: redisClient,
    keyPrefix: 'faucet',
    blockDuration: 600,
    inmemoryBlockDuration: 600,
    execEvenly: false,
    blockOnPointsConsumed: 1,
    inmemoryBlockOnConsumed: 1,
    insuranceLimiter: new RateLimiterMemory( // It will be used only on Redis error as insurance
      {
        points: 1, // 1 is fair if you have 5 workers and 1 cluster
        duration: 600,
        execEvenly: false,
      },
    ),
  },
);

export const rateLimiterMiddlewareFaucet = (req, res, next) => {
  // Requires ./helpers/storeIp.js to be run in middleware before executing this function
  // Consume 1 point for each action

  rateLimiterFaucet.consume(res.locals.ip, 1) // or req.ip
    .then((result) => {
      // rateLimiterFaucet.penalty(res.locals.ip, 1);
      next();
    })
    .catch((rejRes) => {
      console.log(rejRes);
      console.log('too many requests from ip');
      res.status(429).send('Too Many Requests');
    });
};

export const rateLimiterMiddlewareUser = (req, res, next) => {
  // Consume 1 point for each action
  rateLimiterUser.consume(req.user.id, 1) // or req.ip
    .then(() => {
      // rateLimiterUser.penalty(res.locals.ip, 1);
      next();
    })
    .catch((rejRes) => {
      console.log('too many requests from user');
      res.status(429).send('Too Many Requests');
    });
};

export const rateLimiterMiddlewareIp = (req, res, next) => {
  // Requires ./helpers/storeIp.js to be run in middleware before executing this function
  // Consume 1 point for each action
  rateLimiterIp.consume(res.locals.ip, 1) // or req.ip
    .then(() => {
      // rateLimiterIp.penalty(res.locals.ip, 1);
      next();
    })
    .catch((rejRes) => {
      console.log('too many requests from ip');
      res.status(429).send('Too Many Requests');
    });
};
