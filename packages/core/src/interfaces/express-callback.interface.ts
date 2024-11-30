import { Request, Response } from "express";

export interface ExpressCallback<T> {
  (req: Request, res: Response): T;
}
