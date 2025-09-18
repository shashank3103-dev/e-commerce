import { config } from "./config/env.js";
import app from "./app.js";
import { prisma } from "./prisma.js";
import { logger } from "./config/logger";

async function main() {
  await prisma.$connect();
  app.listen(config.port, () =>
    logger.info(`🚀 Server on http://localhost:${config.port}`)
  );
  // For graceful shutdown
  process.on("SIGINT", async () => {
    logger.info("SIGINT received. Shutting down gracefully...");
    await prisma.$disconnect();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received. Shutting down gracefully...");
    await prisma.$disconnect();
    process.exit(0);
  });
}
main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
