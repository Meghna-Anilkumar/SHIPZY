import { Router } from "express";
import type { MenuController } from "../controllers/menu.controller";

export const createMenuRoutes = (menuController: MenuController): Router => {
  const router = Router();
  router.get("/", menuController.getMenu);
  return router;
};
