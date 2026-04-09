import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ChatMessageDocument } from "../../../types/CourtServerTypes";

interface MessageBubbleProps {
  message: ChatMessageDocument;
  isCurrentUser: boolean;
}

const getAvatarColor = (senderId: string): string => {
  const colors = ["#F97316", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#EC4899"];
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatTimestamp = (createdAt: any): string => {
  if (!createdAt || !createdAt.toDate) return "just now";
  const date = createdAt.toDate();
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  const avatarColor = getAvatarColor(message.senderId);
  const initial = (message.senderName || "?")[0].toUpperCase();

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.containerCurrentUser,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.username, { color: "#F97316" }]}>
            {message.senderName}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(message.createdAt)}
          </Text>
        </View>
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  containerCurrentUser: {
    borderLeftWidth: 3,
    borderLeftColor: "#F97316",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 8,
  },
  timestamp: {
    color: "#666",
    fontSize: 11,
  },
  messageText: {
    color: "#DCDDDE",
    fontSize: 15,
    lineHeight: 20,
  },
});

export default MessageBubble;
