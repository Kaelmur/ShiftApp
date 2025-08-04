import express from "express";
import { errorHandler } from "./src/middlewares/errorMiddleware";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import brigadeRoutes from "./src/routes/brigadeRotes";
import companyRoutes from "./src/routes/companyRoutes";
import shiftRoutes from "./src/routes/shiftRoutes";
import cors from "cors";

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brigades", brigadeRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/shifts", shiftRoutes);

// Start Server
const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
};

// Cron Job for automatically end shift at 5 pm
// import "./src/cron/endShift";

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// ERROR HANDLER - always last
app.use(errorHandler);
