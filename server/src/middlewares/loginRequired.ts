import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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

    const jwt_secret_access_token = process.env.JWT_SECRET_ACCESS_TOKEN;

    if (!jwt_secret_access_token) {
      console.log("Failed to get JWT tokens from .env file");
      return res.sendStatus(500);
    }

    const user = jwt.verify(token, jwt_secret_access_token) as Jwt;
    console.log(user);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    (req as any).user = user;
    next();
  } catch (e: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default loginRequired;
