import { Request } from "express";

export const getIp = (req: Request): string => {
  return req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
};

export const getTimestamp = (): number => {
  return new Date().getTime();
};
