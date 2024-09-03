import { Request, Response } from "express";
import { db } from "../utils/db";
import { AuthRequest } from "../server";

export const deleteAll = async (req: Request, res: Response) => {
  try {
    await db.profile.deleteMany({});
    await db.user.deleteMany({});

    return res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid id" });

    await db.profile.delete({
      where: {
        userId: id,
      },
    });

    await db.user.delete({
      where: {
        id: id,
      },
    });

    return res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      include: {
        profile: true,
      },
    });

    return res.json(users);
  } catch (e: any) {
    console.log(e);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await db.user.findUnique({
      where: {
        id: id,
      },
      include: {
        profile: true,
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid id" });

    return res.json(user);
  } catch (e: any) {
    console.log(e);
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chats = await db.chat.findMany({
      where: {
        members: {
          some: {
            id: id,
          },
        },
      },
      include: {
        lastMessage: {
          select: {
            content: true,
            type: true,
            created_At: true,
          },
        },
        members: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
          orderBy: {
            profile: {
              name: "asc",
            },
          },
        },
      },
    });

    return res.json(chats);
  } catch (e: any) {
    console.log(e);
  }
};

export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).user;

    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) return res.json({ message: "Invalid id" });

    await db.user.update({
      data: {
        profile: {
          update: {
            imageUrl: `http://localhost:${process.env.PORT || 5001}/public/uploads/files/${req.file!.filename}`,
          },
        },
      },
      where: {
        id: id,
      },
    });

    return res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};
