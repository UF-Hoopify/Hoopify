import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
  channelName?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChangeText,
  onSend,
  isSending,
  channelName = "court-chat",
}) => {
  const insets = useSafeAreaInsets();
  const canSend = value.trim().length > 0 && !isSending;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Message #${channelName}`}
          placeholderTextColor="#666"
          multiline
          maxLength={2000}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={!canSend}
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="send" size={18} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    backgroundColor: "#121212",
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#333333",
  },
  sendButton: {
    backgroundColor: "#F97316",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#8B400C",
  },
});

export default MessageInput;
