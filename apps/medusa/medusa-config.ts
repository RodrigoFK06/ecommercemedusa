import { defineConfig, loadEnv } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const REDIS_URL = process.env.REDIS_URL
const STRIPE_API_KEY = process.env.STRIPE_API_KEY
const IS_TEST = process.env.NODE_ENV === 'test'

// General Redis options (para cache y event-bus)
const redisOptions = {
  maxRetriesPerRequest: null,
  connectTimeout: 10000,
  tls: {}, // Necesario si estás usando rediss:// (Upstash por ejemplo)
}

// Redis options específicas para BullMQ (workflow-engine)
const redisOptionsForBullMQ = {
  ...redisOptions,
  maxRetriesPerRequest: null, // ❗ Obligatorio para BullMQ
}

const cacheModule = IS_TEST
  ? { resolve: '@medusajs/medusa/cache-inmemory' }
  : {
      resolve: '@medusajs/medusa/cache-redis',
      options: {
        redisUrl: REDIS_URL,
        redisOptions,
      },
    }

const eventBusModule = IS_TEST
  ? { resolve: '@medusajs/medusa/event-bus-local' }
  : {
      resolve: '@medusajs/medusa/event-bus-redis',
      options: {
        redisUrl: REDIS_URL,
        redisOptions,
      },
    }

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
    }

module.exports = defineConfig({
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
              replacement: (val: string) => val.replace(/\\/g, '/'), // ✅ tipado
            },
          ],
        },        
      }
    },
  },
})

// plugins opcionales
/*
plugins: [
  {
    resolve: '@lambdacurry/medusa-product-reviews',
    options: {},
  },
]
*/
