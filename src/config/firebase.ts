import { cert, initializeApp } from "firebase-admin/app";

const config = process.env.FIREBASE_CONFIG as any;
const credential = JSON.parse(config);
credential.private_key = (process.env.FIREBASE_PRIVATE_KEY as string).replace(
    /\\n/g,
    "\n"
);
export const connectToFirebase = () => {
    try {
        initializeApp({ credential: cert(credential) });
        console.log("Connecting to Firebase");
    } catch (err) {
        console.log("Failed to connect to Firebase", err);
    }
};
