import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN } from "../utils/getEnv";

export interface Jwt extends JwtPayload {
  id: string;
  name: string;
  imageUrl: string;
}

const loginRequired = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token is required" });

    const accessToken = ACCESS_TOKEN;

    const user = jwt.verify(token, accessToken) as Jwt;
    if (!user) return res.status(100).json({ message: "Invalid token" });

    (req as any).user = user;
    next();
  } catch (e: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default loginRequired;
