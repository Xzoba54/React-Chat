import { Request, Response } from "express";
import { db } from "../utils/db";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;

    if (!Array.isArray(members)) return res.status(400).json({ message: "Too few membersss" });
    if (members.length < 2) return res.status(400).json({ message: "Too few members" });

    const chat = await db.chat.create({
      data: {
        name: name ? name : null,
        members: {
          connect: members.map((id) => ({ id })),
        },
      },
    });

    return res.json(chat);
  } catch (e: any) {
    console.log(e);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chat = await db.chat.findUnique({
      where: {
        id: id,
      },
      include: {
        lastMessage: {
          select: {
            content: true,
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

    return res.json(chat);
  } catch (e: any) {
    console.log(e);
  }
};

export const getMessagesById = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    const messages = await db.message.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        parent: true,
        reactions: {
          select: {
            userId: true,
            emoji: true,
          },
        },
      },
    });

    return res.json(messages);
  } catch (e: any) {
    console.log(e);
  }
};
