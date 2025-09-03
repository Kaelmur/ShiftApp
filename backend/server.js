"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./src/middlewares/errorMiddleware");
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const brigadeRotes_1 = __importDefault(require("./src/routes/brigadeRotes"));
const companyRoutes_1 = __importDefault(require("./src/routes/companyRoutes"));
const reportRoutes_1 = __importDefault(require("./src/routes/reportRoutes"));
const shiftRoutes_1 = __importDefault(require("./src/routes/shiftRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Middleware to handle CORS
app.use(
  (0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/brigades", brigadeRotes_1.default);
app.use("/api/companies", companyRoutes_1.default);
app.use("/api/shifts", shiftRoutes_1.default);
app.use("/api/reports", reportRoutes_1.default);
// Start Server
const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
};
// Cron Job for automatically end shift at 5 pm
require("./src/cron/endShift");
app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);
// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});
// ERROR HANDLER - always last
app.use(errorMiddleware_1.errorHandler);
//# sourceMappingURL=server.js.map
