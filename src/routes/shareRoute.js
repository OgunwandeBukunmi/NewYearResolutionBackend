import express from "express";
import { createShare } from "../controllers/shareController.js";

const router = express.Router();

router.post("/", createShare);


export default router;
