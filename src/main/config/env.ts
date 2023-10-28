/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '06c219e5bc8378f3a8a3f83b4b7e4649'
}
