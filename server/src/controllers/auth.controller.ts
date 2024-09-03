import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db";
import jwt from "jsonwebtoken";
import { Jwt } from "../middlewares/loginRequired";

const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validEmail = (email: string): boolean => {
  return regex.test(email);
};

const validPassword = (pwd: string): boolean => {
  if (!pwd.trim()) return false;

  return true;
};

const validName = (name: string): boolean => {
  if (!name.trim()) return false;

  return true;
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const createWithEmail = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !validEmail(email)) return res.status(400).json({ message: "Email is not valid" });
    if (!password || !validPassword(password)) return res.status(400).json({ message: "Password is not valid" });
    if (!name || !validName(name)) return res.status(400).json({ message: "Name is not valid" });

    const userWithEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userWithEmail) return res.status(400).json({ message: "Email already in use" });

    const userWithName = await db.user.findFirst({
      where: {
        profile: {
          name: name,
        },
      },
    });

    if (userWithName) return res.status(400).json({ message: "Name already in use" });

    const hash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email: email,
        password: hash,
        provider: "Email",
        profile: {
          create: {
            name: name,
          },
        },
      },
    });

    return res.json(user);
  } catch (e: any) {
    console.log(e);
  }
};

export const loginWithEmail = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    const user = await db.user.findUnique({
      where: {
        email: email,
        provider: "Email",
      },
      include: {
        profile: true,
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!(await comparePassword(password, user.password || ""))) return res.status(401).json({ message: "Invalid credentials" });

    const payload: Jwt = {
      id: user.id,
      name: user!.profile!.name,
      imageUrl: user!.profile?.imageUrl || "",
    };

    const jwt_secret_access_token = process.env.JWT_SECRET_ACCESS_TOKEN;
    const jwt_secret_refresh_token = process.env.JWT_SECRET_REFRESH_TOKEN;

    if (!jwt_secret_access_token || !jwt_secret_refresh_token) {
      console.log("Failed to get JWT tokens from .env file");
      return res.sendStatus(500);
    }

    const access_token = jwt.sign(payload, jwt_secret_access_token, { expiresIn: "1m" });
    const refresh_token = jwt.sign(payload, jwt_secret_refresh_token, { expiresIn: "30m" });

    res.cookie("refresh_token", refresh_token, { httpOnly: true });

    return res.json({ token: access_token });
  } catch (e: any) {
    console.log(e);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) return res.status(400).json({ message: "Refresh token is required" });

    const jwt_secret_refresh_token = process.env.JWT_SECRET_REFRESH_TOKEN;
    const jwt_secret_access_token = process.env.JWT_SECRET_ACCESS_TOKEN;

    if (!jwt_secret_refresh_token || !jwt_secret_access_token) {
      console.log("Failed to get JWT tokens from .env file");
      return res.sendStatus(500);
    }

    const data = jwt.verify(refresh_token, jwt_secret_refresh_token) as Jwt;
    if (!data) return res.status(401).json({ message: "Invalid refresh token" });

    const payload: Jwt = {
      id: data.id,
      name: data.name,
      imageUrl: data.imageUrl,
    };

    const access_token = jwt.sign(payload, jwt_secret_access_token, { expiresIn: "1m" });

    return res.json({ token: access_token });
  } catch (e: any) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    for (const cookie in req.cookies) {
      res.clearCookie(cookie);
    }

    res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};
