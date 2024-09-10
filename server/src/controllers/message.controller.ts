import { Request, Response } from "express";
import { db } from "../utils/db";
import path from "path";
import fs from "fs";
import { io, usersOnline } from "../server";

export const create = async (req: Request, res: Response) => {
  try {
    const { chatId, senderId, content, type, replyId } = req.body;

    if (!chatId || !senderId || !type) return res.status(400).json({ message: "Invalid data" });
    if (type === "Text" && !content) return res.status(400).json({ message: "Invalid data" });

    let contentData = "";
    if (type === "Text") contentData = content;
    else contentData = `http://localhost:${process.env.PORT || 5001}/public/uploads/voices/${req.file!.filename}`;

    if (replyId) {
      const messageParent = await db.message.findUnique({
        where: {
          id: replyId,
        },
      });

      if (!messageParent) return res.status(400).json({ message: "Invalid data" });
    }

    const message = await db.message.create({
      data: {
        content: contentData,
        type: type,
        chatId: chatId,
        parentId: replyId ? replyId : null,
        senderId: senderId,
      },
      include: {
        parent: true,
      },
    });

    const chat = await db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessageId: message.id,
      },
      include: {
        members: {
          select: {
            id: true,
          },
        },
      },
    });

    io.to(chatId).emit("receive-message", message);

    for (const member of chat.members) {
      const memberSocket = usersOnline.get(member.id);
      if (memberSocket) {
        io.to(member.id).emit("new-message", { message, chatId });
      }
    }

    return res.json(message);
  } catch (e: any) {
    console.log(e);
  }
};

export const deleteAll = async (req: Request, res: Response) => {
  try {
    const voicesPath = path.join(process.cwd(), "/public/uploads/voices/");

    fs.readdir(voicesPath, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(voicesPath, file), (err) => {
          if (err) throw err;
        });
      }
    });

    await db.message.deleteMany({});

    return res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};

export const reaction = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const { id } = (req as any).user;

    if (!content || !id) return res.status(400).json({ message: "Invalid data" });

    const message = await db.message.findUnique({
      where: {
        id: messageId,
      },
    });

    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!message) return res.status(400).json({ message: "Invalid message id" });
    if (!user) return res.status(400).json({ message: "Invalid user id" });

    const alreadyReacted = await db.reaction.findFirst({
      where: {
        userId: id,
        messageId: messageId,
        emoji: content,
      },
    });

    if (alreadyReacted) {
      const reaction = await db.reaction.delete({
        where: {
          id: alreadyReacted.id,
        },
      });

      io.emit("receive-remove-reaction", reaction);

      return res.sendStatus(200);
    }

    const reaction = await db.reaction.create({
      data: {
        messageId: messageId,
        emoji: content,
        userId: id,
      },
    });

    io.emit("receive-add-reaction", reaction);

    return res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Id is required" });

    const message = await db.message.findUnique({
      where: {
        id: id,
      },
    });

    if (!message) return res.status(400).json({ message: "Invalid id" });

    await db.reaction.deleteMany({
      where: {
        messageId: id,
      },
    });

    await db.message.delete({
      where: {
        id: id,
      },
    });

    return res.sendStatus(200);
  } catch (e: any) {
    console.log(e);
  }
};
