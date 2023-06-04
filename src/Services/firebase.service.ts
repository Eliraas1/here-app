import { TaskType } from "Models/Task";
import { UserType } from "../Models/User";
import admin from "firebase-admin";
import axios from "axios";

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
    // axios(config)
    //   .then(async (response: any) => {
    //     const results: [] = response.data.results;
    //     const removedTokens = [];
    //     results.forEach((res: any, i) => {
    //       res.error
    //         ? (console.log(
    //             "Push Notification Failed With Error: " +
    //               res.error +
    //               "For fcm token:",
    //             user.fcmToken[i]
    //           ),
    //           removedTokens.push(user.fcmToken[i]))
    //         : console.log("Push Notification Send To", {
    //             fcmToken: user.fcmToken[i],
    //           });
    //     });
    //     removedTokens.length &&
    //       (await this.userService.deleteFcmTokensByTokens(
    //         user._id,
    //         removedTokens
    //       ));
    //   })
    //   .catch((error: any) => {
    //     console.log(error.message);
    //   });
};
