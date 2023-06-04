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
export const sendPushNotification = async (
    user?: UserType,
    task?: TaskType
) => {
    if (!user || !task) return;
    const deviceTokens = user.fcmToken;
    const [hour, minutes] = task.targetDate
        ?.toISOString()
        .split("T")[1]
        ?.split(":") || ["", ""];
    const fixedHours = [hour, minutes].join(":");
    const title = `המשימה ${task.name} עוד לא הושלמה`;
    const body = `יש לך עד השעה ${fixedHours}`;
    const message = {
        tokens: deviceTokens,
        notification: {
            title,
            body,
        },
    };
    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log("Successfully sent push notification:", response);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};

export const sendNotification = async (user?: UserType, task?: TaskType) => {
    if (!user || !task) return;

    const [hour, minutes] = task.targetDate
        ?.toISOString()
        .split("T")[1]
        ?.split(":") || ["", ""];
    const fixedHours = [hour, minutes].join(":");
    const title = `המשימה ${task.name} עוד לא הושלמה`;
    const body = `יש לך עד השעה ${fixedHours}`;
    const data = {
        registration_ids: user?.fcmToken,
        direct_boot_ok: true,
        notification: {
            content_available: true,
            priority: "high",
            android: {
                channelId: user?._id,
            },
            body,
            title,
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
