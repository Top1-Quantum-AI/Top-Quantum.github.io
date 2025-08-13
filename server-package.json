{
  "name": "quantum-ai-server",
  "version": "1.0.0",
  "description": "Production-ready server for Quantum AI System with Max Planck methodology",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "docker:build": "docker build -t quantum-ai-server .",
    "docker:run": "docker run -p 3001:3001 quantum-ai-server",
    "migrate": "tsx src/database/migrate.ts",
    "seed": "tsx src/database/seed.ts"
  },
  "keywords": [
    "quantum",
    "ai",
    "planck",
    "physics",
    "simulation",
    "cryptography",
    "nodejs",
    "express",
    "typescript"
  ],
  "author": "Quantum AI Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "ioredis": "^5.3.2",
    "openai": "^4.20.1",
    "complex.js": "^2.1.1",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "nodemailer": "^6.9.7",
    "bull": "^4.12.2",
    "socket.io": "^4.7.4",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "express-slow-down": "^2.0.1",
    "express-brute": "^1.0.1",
    "express-brute-redis": "^0.0.1",
    "node-cron": "^3.0.3",
    "uuid": "^9.0.1",
    "crypto-js": "^4.2.0",
    "moment": "^2.29.4",
    "lodash": "^4.17.21",
    "axios": "^1.6.2",
    "cheerio": "^1.0.0-rc.12",
    "pdf-parse": "^1.1.1",
    "csv-parser": "^3.0.0",
    "xml2js": "^0.6.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/nodemailer": "^6.4.14",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "@types/uuid": "^9.0.7",
    "@types/crypto-js": "^4.2.1",
    "@types/lodash": "^4.14.202",
    "@types/xml2js": "^0.4.14",
    "@types/jest": "^29.5.8",
    "@types/supertest": "^2.0.16",
    "typescript": "^5.3.3",
    "tsx": "^4.6.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "prettier": "^3.1.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/quantum-ai/server.git"
  },
  "bugs": {
    "url": "https://github.com/quantum-ai/server/issues"
  },
  "homepage": "https://github.com/quantum-ai/server#readme",
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "roots": ["<rootDir>/src"],
    "testMatch": ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!src/**/*.d.ts",
      "!src/index.ts"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html"]
  }
}