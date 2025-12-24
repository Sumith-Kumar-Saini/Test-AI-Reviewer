import { Request, Response, Router } from "express";
import { reviewController } from "../controllers/reviewer";

const router = Router();

router.post("/reviewer", reviewController);

export default router;
