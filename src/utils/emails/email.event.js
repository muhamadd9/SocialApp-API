import { EventEmitter } from "node:events";
import jwt from "jsonwebtoken";
import { signUp } from "./generateHTML.js";
import sendEmails, { subjects } from "./sendEmails.js";
export const emailEmmiter = new EventEmitter();

emailEmmiter.on("sendEmail", async (email, otp, subject) => {
  await sendEmails({
    to: email,
    subject,
    html: signUp(otp),  
  });
});
