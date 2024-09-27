import { Request, Response } from "express";
import { db } from "../utils/db";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;
    const { id } = (req as any).user;

    if (!Array.isArray(members)) return res.status(400).json({ message: "Too few membersss" });
    if (members.length === 0) return res.status(400).json({ message: "Too few members" });

    const set: Set<string> = new Set();
    set.add(id);

    members.forEach((member) => set.add(member));

    const chat = await db.chat.create({
      data: {
        name: name ? name : null,
        members: {
          connect: Array.from(set).map((memberId) => ({ id: memberId })),
        },
      },
      include: {
        lastMessage: true,
        members: {
          select: {
            id: true,
            profile: {
              select: {
                imageUrl: true,
                name: true,
              },
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
            isDeleted: true,
          },
        },
        members: {
          select: {
            id: true,
            created_at: true,
            profile: {
              select: {
                name: true,
                imageUrl: true,
                status: true,
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
            id: true,
            userId: true,
            messageId: true,
            emoji: true,
          },
        },
      },
      orderBy: {
        created_At: "asc",
      },
    });

    return res.json(messages);
  } catch (e: any) {
    console.log(e);
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Id is required" });

    const chat = await db.chat.findUnique({
      where: {
        id: id,
      },
    });

    if (!chat) return res.status(400).json({ message: "Invalid id" });

    await db.reaction.deleteMany({
      where: {
        message: {
          chatId: id,
        },
      },
    });

    await db.message.deleteMany({
      where: {
        chatId: id,
      },
    });

    await db.chat.delete({
      where: {
        id: id,
      },
    });

    return res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};

export const getChatImages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    if (!chatId) return res.status(400).json({ message: "Id is required" });

    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) return res.status(400).json({ message: "Invalid id" });

    const images = await db.message.findMany({
      where: {
        chatId: chatId,
        type: "Image",
        isDeleted: false,
      },
    });

    return res.json(images);
  } catch (e: any) {
    console.log(e);
  }
};
