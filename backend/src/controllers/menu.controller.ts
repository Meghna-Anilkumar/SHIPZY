import type { Request, Response } from "express";
import { MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/httpStatus";
import type { IMenuService } from "../services/menu.service";

export class MenuController {
  constructor(private readonly menuService: IMenuService) {}

  getMenu = async (_req: Request, res: Response): Promise<void> => {
    const menu = await this.menuService.getMenu();
    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.MENU_FETCHED,
      data: menu
    });
  };
}
