import express from "express";
import { runAlgorithm, compareAlgorithms } from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/run", runAlgorithm);
router.post("/compare", compareAlgorithms);


export default router;
