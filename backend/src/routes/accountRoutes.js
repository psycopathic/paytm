import express from "express";
import { balance, transfer } from "../controllers/accountController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/balance",authMiddleware, balance);
router.post("/transfer",authMiddleware, transfer);

export default router;