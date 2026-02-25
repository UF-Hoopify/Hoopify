import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../config/firebaseConfig";

interface Message {
  _id: string;
  text: string;
  senderId: string;
  createdAt: any;
  type?: "text" | "invite";
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isMounted = useRef(true);
  const flatListRef = useRef<FlatList>(null);

  const route = useRoute();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  // @ts-ignore
  const { recipientId, recipientName } = route.params || {};

  useEffect(() => {
    if (recipientName) {
      navigation.setOptions({ title: recipientName });
    }
  }, [navigation, recipientName]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const CHAT_ID = currentUserId
    ? [currentUserId, recipientId || "test_user"].sort().join("_")
    : null;

  useEffect(() => {
    isMounted.current = true;

    if (!CHAT_ID) return;

    const messagesRef = collection(db, "chats", CHAT_ID, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isMounted.current) {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [CHAT_ID]);

  const handleSend = useCallback(async () => {
    if (inputText.trim().length === 0 || !CHAT_ID || !currentUserId) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, "chats", CHAT_ID, "messages"), {
        text: inputText.trim(),
        createdAt: serverTimestamp(),
        senderId: currentUserId,
        type: "text",
      });

      if (isMounted.current) {
        setInputText("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      if (isMounted.current) {
        setIsSending(false);
      }
    }
  }, [inputText, CHAT_ID, currentUserId]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text
          style={[styles.messageText, isMe ? styles.myText : styles.theirText]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  if (isAuthLoading || !currentUserId) {
    return (
      <SafeAreaView
        edges={["bottom"]}
        style={[styles.container, styles.loadingContainer]}
      >
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            inverted
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
              </View>
            }
          />
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#A0A0A0"
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={isSending || !CHAT_ID}
              style={[
                styles.sendButton,
                isSending && styles.sendButtonDisabled,
              ]}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.sendText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },

  loadingContainer: { justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#A0A0A0", fontSize: 16 },

  chatContainer: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingVertical: 20 },

  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: "80%",
    elevation: 1,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F97316",
    borderBottomRightRadius: 2,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1E1E1E",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#333333",
  },

  messageText: { fontSize: 16, lineHeight: 22 },
  myText: { color: "#FFFFFF" },
  theirText: { color: "#FFFFFF" },

  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#A0A0A0", fontSize: 16 },

  inputWrapper: {
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderColor: "#2A2A2A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#333333",
  },
  sendButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendButtonDisabled: { backgroundColor: "#8B400C" },
  sendText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
