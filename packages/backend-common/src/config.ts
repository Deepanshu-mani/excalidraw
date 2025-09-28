// Re-export from centralized config
export {
  HTTP_PORT as PORT,
  WS_PORT,
  DATABASE_URL,
  JWT_SECRET,
  validateConfig,
  config,
} from "@repo/common/config";
