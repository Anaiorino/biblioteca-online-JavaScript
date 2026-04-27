import multer from "multer";
import path from "path";
import crypto from "crypto";
import { Request } from "express";

export const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "..", "..", "uploads"),

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    const hash = crypto.randomBytes(6).toString("hex");
    const fileName = `${hash}-${file.originalname}`;

    callback(null, fileName);
  },
});