import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { ChatMessageDocument } from "../types/CourtServerTypes";

/**
 * Ensures a default "court-chat" channel exists for the given court.
 * Returns the channel ID.
 */
export const ensureDefaultChannel = async (
  courtId: string,
): Promise<string> => {
  const channelsRef = collection(db, "courts", courtId, "channels");
  const snapshot = await getDocs(channelsRef);

  // If any channel exists, return the first one (default)
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  // Create the default channel
  const docRef = await addDoc(channelsRef, {
    name: "court-chat",
    type: "text",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Subscribes to real-time messages for a channel.
 * Returns an unsubscribe function.
 */
export const subscribeToMessages = (
  courtId: string,
  channelId: string,
  onUpdate: (messages: ChatMessageDocument[]) => void,
  onError?: (error: Error) => void,
) => {
  const messagesRef = collection(
    db,
    "courts",
    courtId,
    "channels",
    channelId,
    "messages",
  );
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessageDocument[];
      onUpdate(messages);
    },
    (error) => {
      console.error("[ChatService] Error listening to messages:", error);
      onError?.(error);
    },
  );
};

/**
 * Sends a message to a channel.
 */
export const sendMessage = async (
  courtId: string,
  channelId: string,
  text: string,
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User must be logged in to send messages.");

  const userSnap = await getDoc(doc(db, "users", currentUser.uid));
  const senderName = userSnap.exists()
    ? userSnap.data().displayName || "Anonymous"
    : "Anonymous";

  const messagesRef = collection(
    db,
    "courts",
    courtId,
    "channels",
    channelId,
    "messages",
  );

  await addDoc(messagesRef, {
    text: text.trim(),
    senderId: currentUser.uid,
    senderName,
    createdAt: serverTimestamp(),
  });
};
