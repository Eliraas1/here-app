import { TaskType } from "Models/Task";
import { UserType } from "../Models/User";
import admin from "firebase-admin";

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
