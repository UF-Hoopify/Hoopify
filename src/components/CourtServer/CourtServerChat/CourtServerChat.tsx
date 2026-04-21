import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth } from "../../../config/firebaseConfig";
import {
  ensureDefaultChannel,
  sendMessage,
  subscribeToMessages,
} from "../../../services/ChatService";
import { ChatMessageDocument } from "../../../types/CourtServerTypes";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface CourtServerChatProps {
  courtServerId: string;
  onBack: () => void;
}

const CourtServerChat: React.FC<CourtServerChatProps> = ({
  courtServerId,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessageDocument[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUserId = auth.currentUser?.uid ?? null;
  const isMounted = useRef(true);
  const listRef = useRef<FlatList<ChatMessageDocument> | null>(null);

  const onlineCount = new Set(messages.map((m) => m.senderId)).size;

  useEffect(() => {
    isMounted.current = true;
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        const id = await ensureDefaultChannel(courtServerId);
        if (!isMounted.current) return;
        setChannelId(id);
        setErrorMessage(null);

        unsubscribe = subscribeToMessages(
          courtServerId,
          id,
          (msgs) => {
            if (isMounted.current) {
              setMessages(msgs);
              setIsLoading(false);
              setErrorMessage(null);
            }
          },
          (error) => {
            console.error("[CourtServerChat] Subscription error:", error);
            if (isMounted.current) {
              setIsLoading(false);
              setErrorMessage(
                "Chat is unavailable right now. Check Firestore permissions and try again.",
              );
            }
          },
        );
      } catch (error) {
        console.error("[CourtServerChat] Init error:", error);
        if (isMounted.current) {
          setIsLoading(false);
          setErrorMessage(
            "Chat failed to load. Check Firestore permissions and try again.",
          );
        }
      }
    };

    init();

    return () => {
      isMounted.current = false;
      unsubscribe?.();
    };
  }, [courtServerId]);

  useEffect(() => {
    if (messages.length === 0) return;

    const timeoutId = setTimeout(() => {
      listRef.current?.scrollToEnd?.({ animated: true });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!channelId || !currentUserId || inputText.trim().length === 0) return;

    setIsSending(true);
    const textToSend = inputText;
    setInputText("");

    try {
      await sendMessage(courtServerId, channelId, textToSend);
    } catch (error) {
      console.error("[CourtServerChat] Send error:", error);
      if (isMounted.current) setInputText(textToSend);
    } finally {
      if (isMounted.current) setIsSending(false);
    }
  }, [channelId, currentUserId, courtServerId, inputText]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessageDocument }) => (
      <MessageBubble
        message={item}
        isCurrentUser={item.senderId === currentUserId}
      />
    ),
    [currentUserId],
  );

  const keyExtractor = useCallback(
    (item: ChatMessageDocument, index: number) => {
      return item.id ? item.id.toString() : `fallback-key-${index}`;
    },
    [],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F97316" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerChannel}># general</Text>
          <Text style={styles.headerDot}> · </Text>
          <Text style={styles.headerOnline}>{onlineCount} online</Text>
        </View>

        <View style={styles.headerIcons}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#FFF"
            style={styles.headerIcon}
          />
          <Ionicons
            name="notifications-outline"
            size={20}
            color="#FFF"
            style={styles.headerIcon}
          />
          <Ionicons name="people-outline" size={20} color="#FFF" />
        </View>
      </View>

      {/* Messages */}
      <View style={styles.listContainer}>
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={48}
                color="#333"
              />
              <Text style={styles.emptyTitle}>Welcome to #general</Text>
              <Text style={styles.emptyText}>
                {errorMessage ?? "Be the first to send a message!"}
              </Text>
            </View>
          }
        />
      </View>

      {/* Input */}
      <MessageInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        isSending={isSending}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerChannel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerDot: {
    color: "#888",
    fontSize: 14,
  },
  headerOnline: {
    color: "#888",
    fontSize: 13,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 16,
  },
  list: {
    flex: 1,
    minHeight: 0,
  },
  listContainer: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingTop: 12,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
});

export default CourtServerChat;
