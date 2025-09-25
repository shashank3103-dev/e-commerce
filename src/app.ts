import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error";
import mainRoutes from "./routes/main.routes";

const app = express();
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.use(morgan("dev"));

app.get("/api/v1/ping", (_req, res) => {
  res.json({ success: true, message: "pong 🏓 - API is working!" });
});
app.use("/api/v1", mainRoutes);
app.get("/", (_req, res) => {
  res.json({ success: true, message: "Welcome 🚀 Use /api/v1 for endpoints" });
});

// 404
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Not Found" })
);
// errors
app.use(errorHandler);

export default app;
