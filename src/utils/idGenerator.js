import crypto from "crypto";

export const generateId = () => crypto.randomBytes(6).toString("hex");