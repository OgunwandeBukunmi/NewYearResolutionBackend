import express from "express";
import { getSharePage } from "../controllers/shareController.js";

const router = express.Router();

router.get("/",getSharePage)

export default router;