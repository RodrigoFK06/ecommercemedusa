"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
const REDIS_URL = process.env.REDIS_URL;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const IS_TEST = process.env.NODE_ENV === 'test';
// General Redis options (para cache y event-bus)
const redisOptions = {
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
    tls: {}, // Necesario si estás usando rediss:// (Upstash por ejemplo)
};
// Redis options específicas para BullMQ (workflow-engine)
const redisOptionsForBullMQ = {
    ...redisOptions,
    maxRetriesPerRequest: null, // ❗ Obligatorio para BullMQ
};
const cacheModule = IS_TEST
    ? { resolve: '@medusajs/medusa/cache-inmemory' }
    : {
        resolve: '@medusajs/medusa/cache-redis',
        options: {
            redisUrl: REDIS_URL,
            redisOptions,
        },
    };
const eventBusModule = IS_TEST
    ? { resolve: '@medusajs/medusa/event-bus-local' }
    : {
        resolve: '@medusajs/medusa/event-bus-redis',
        options: {
            redisUrl: REDIS_URL,
            redisOptions,
        },
    };
const workflowEngineModule = IS_TEST
    ? { resolve: '@medusajs/medusa/workflow-engine-inmemory' }
    : {
        resolve: '@medusajs/medusa/workflow-engine-redis',
        options: {
            redis: {
                url: REDIS_URL,
                options: redisOptionsForBullMQ,
            },
        },
    };
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: REDIS_URL,
        redisPrefix: process.env.REDIS_PREFIX,
        http: {
            storeCors: process.env.STORE_CORS || '',
            adminCors: process.env.ADMIN_CORS || '',
            authCors: process.env.AUTH_CORS || '',
            jwtSecret: process.env.JWT_SECRET || 'supersecret',
            cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
        },
    },
    modules: [
        {
            resolve: '@medusajs/medusa/payment',
            options: {
                providers: [
                    {
                        resolve: '@medusajs/medusa/payment-stripe',
                        id: 'stripe',
                        options: {
                            apiKey: STRIPE_API_KEY,
                        },
                    },
                ],
            },
        },
        cacheModule,
        eventBusModule,
        workflowEngineModule,
    ],
    admin: {
        backendUrl: process.env.ADMIN_BACKEND_URL,
        path: "/app", // 👈 esto es obligatorio y no puede ser '/'
        vite: (config) => {
            return {
                ...config,
                optimizeDeps: {
                    include: ['@lambdacurry/medusa-plugins-sdk'],
                },
                resolve: {
                    ...config.resolve,
                    alias: [
                        {
                            find: /^@lambdacurry.*$/,
                            replacement: (val) => val.replace(/\\/g, '/'), // ✅ tipado
                        },
                    ],
                },
            };
        },
    },
});
// plugins opcionales
/*
plugins: [
  {
    resolve: '@lambdacurry/medusa-product-reviews',
    options: {},
  },
]
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFBO0FBQ3ZDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFBO0FBQ2pELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQTtBQUUvQyxpREFBaUQ7QUFDakQsTUFBTSxZQUFZLEdBQUc7SUFDbkIsb0JBQW9CLEVBQUUsSUFBSTtJQUMxQixjQUFjLEVBQUUsS0FBSztJQUNyQixHQUFHLEVBQUUsRUFBRSxFQUFFLDREQUE0RDtDQUN0RSxDQUFBO0FBRUQsMERBQTBEO0FBQzFELE1BQU0scUJBQXFCLEdBQUc7SUFDNUIsR0FBRyxZQUFZO0lBQ2Ysb0JBQW9CLEVBQUUsSUFBSSxFQUFFLDRCQUE0QjtDQUN6RCxDQUFBO0FBRUQsTUFBTSxXQUFXLEdBQUcsT0FBTztJQUN6QixDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUU7SUFDaEQsQ0FBQyxDQUFDO1FBQ0UsT0FBTyxFQUFFLDhCQUE4QjtRQUN2QyxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsU0FBUztZQUNuQixZQUFZO1NBQ2I7S0FDRixDQUFBO0FBRUwsTUFBTSxjQUFjLEdBQUcsT0FBTztJQUM1QixDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsa0NBQWtDLEVBQUU7SUFDakQsQ0FBQyxDQUFDO1FBQ0UsT0FBTyxFQUFFLGtDQUFrQztRQUMzQyxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsU0FBUztZQUNuQixZQUFZO1NBQ2I7S0FDRixDQUFBO0FBRUwsTUFBTSxvQkFBb0IsR0FBRyxPQUFPO0lBQ2xDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSwyQ0FBMkMsRUFBRTtJQUMxRCxDQUFDLENBQUM7UUFDRSxPQUFPLEVBQUUsd0NBQXdDO1FBQ2pELE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsU0FBUztnQkFDZCxPQUFPLEVBQUUscUJBQXFCO2FBQy9CO1NBQ0Y7S0FDRixDQUFBO0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDNUIsYUFBYSxFQUFFO1FBQ2IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZO1FBQ3JDLElBQUksRUFBRTtZQUNKLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFO1lBQ3ZDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxFQUFFO1lBQ3JDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxhQUFhO1lBQ2xELFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxhQUFhO1NBQ3pEO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUDtZQUNFLE9BQU8sRUFBRSwwQkFBMEI7WUFDbkMsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsaUNBQWlDO3dCQUMxQyxFQUFFLEVBQUUsUUFBUTt3QkFDWixPQUFPLEVBQUU7NEJBQ1AsTUFBTSxFQUFFLGNBQWM7eUJBQ3ZCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtRQUNELFdBQVc7UUFDWCxjQUFjO1FBQ2Qsb0JBQW9CO0tBQ3JCO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO1FBQ3pDLElBQUksRUFBRSxNQUFNLEVBQUUsNENBQTRDO1FBRTFELElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2YsT0FBTztnQkFDTCxHQUFHLE1BQU07Z0JBQ1QsWUFBWSxFQUFFO29CQUNaLE9BQU8sRUFBRSxDQUFDLGlDQUFpQyxDQUFDO2lCQUM3QztnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsR0FBRyxNQUFNLENBQUMsT0FBTztvQkFDakIsS0FBSyxFQUFFO3dCQUNMOzRCQUNFLElBQUksRUFBRSxrQkFBa0I7NEJBQ3hCLFdBQVcsRUFBRSxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsV0FBVzt5QkFDbkU7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFBO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBO0FBRUYscUJBQXFCO0FBQ3JCOzs7Ozs7O0VBT0UifQ==