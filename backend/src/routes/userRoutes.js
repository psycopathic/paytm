import express from "express";
import { signup, signin, updateUser, findingUser } from "../controllers/authControllers.js";
import {authMiddleware} from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/update", authMiddleware, updateUser);
router.get("/users", findingUser);

export default router;