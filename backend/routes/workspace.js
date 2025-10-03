import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
} from "../controllers/workspace.js";
import { workspaceSchema } from "../libs/validate-schema.js";

const router = express.Router();

// POST /api/workspaces
router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);
router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
export default router;
