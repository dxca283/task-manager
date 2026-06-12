import express from "express";
import { protectRoute, isAdminRoute } from "../middleware/authMiddleware.js";
import { createSprint, getSprints, getSprintById, updateSprint, deleteSprint } from "../controllers/sprintController.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createSprint);
router.get("/", protectRoute, getSprints);
router.get("/:id", protectRoute, getSprintById);
router.put("/update/:id", protectRoute, isAdminRoute, updateSprint);
router.delete("/:id", protectRoute, isAdminRoute, deleteSprint);

export default router;
