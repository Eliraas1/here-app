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
    const time = task.targetDate?.toLocaleTimeString();
    const title = `משימה עוד לא הושלמה,${task.name}`;
    const body = `יש לך עד השעה ${time}`;
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
