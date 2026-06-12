import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import schedulingRoutes from "./schedulingRoute.js";
import sprintRoutes from "./sprintRoute.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/schedule", schedulingRoutes);
router.use("/sprint", sprintRoutes);

export default router;
