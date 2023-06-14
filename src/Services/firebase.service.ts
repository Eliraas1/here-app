import { TaskType } from "../Models/Task";
import User, { UserType } from "../Models/User";
import admin from "firebase-admin";
import axios from "axios";
import crypto from "crypto";
import { genSalt, hash } from "bcrypt";
import { createUser } from "./user.service";
import { createError } from "./error.services";

interface INotification {
    title: string;
    body: string;
}

export const sendNotification = async (user?: UserType, task?: TaskType) => {
    if (!user || !task) return;

    const [hour, minutes] = task.targetDate
        ?.toISOString()
        .split("T")[1]
        ?.split(":") || ["", ""];
    const fixedHours = [hour, minutes].join(":");
    const title = `Are you Here?`;
    const body = `${task.name}`;
    const data = {
        registration_ids: user?.fcmToken,
        direct_boot_ok: true,
        priority: "high",
        android_channel_id: "Here - default",
        channelId: "Here - default",
        channel_id: "Here - default",
        message: {
            channelId: "Here - default",
            channel_id: "Here - default",
            android_channel_id: "Here - default",
        },
        data: {
            body,
            title,
            taskId: task._id,
            channelId: user?._id,
        },
    };
    SendPushNotification(data, user);
};

const SendPushNotification = (message: any, user?: UserType) => {
    const data = JSON.stringify({ ...message });
    const config = {
        method: "post",
        url: "https://fcm.googleapis.com/fcm/send",
        headers: {
            "Content-Type": "application/json",
            Authorization: `key=${process.env.FIREBASE_NOTIFICATION_KEY}`,
        },
        data: data,
    };

    axios(config)
        .then(async (response: any) => {
            const results: [] = response.data.results;
            console.log({ results });
        })
        .catch((error: any) => {
            console.log(error.message);
        });
};

export const getOrCreateUserWithGoogle = async (idToken: string) => {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;
    if (!email) throw createError(400, "Invalid email");
    const user = await User.findOne({ email });
    if (user) return user;
    const name = email?.split("@")[0] || "Gregorian";
    const password = crypto.randomBytes(16).toString("hex");
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const newUser = await createUser({
        email,
        password: hashedPassword,
        name,
    } as any);
    return newUser;
};
