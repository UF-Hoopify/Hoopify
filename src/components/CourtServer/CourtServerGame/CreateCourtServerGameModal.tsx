import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createCourtGame } from "../../../services/CourtService";
import {
  Competitiveness,
  GameFormat,
  GameVisibility,
} from "../../../types/CourtServerTypes";

interface Props {
  visible: boolean;
  onClose: () => void;
  courtServerId: string;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const CreateCourtServerGameModal = ({
  visible,
  onClose,
  courtServerId,
}: Props) => {
  const [courtDescriptor, setCourtDescriptor] = useState("");
  const [meetupTime, setMeetupTime] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000),
  );
  const [endingTime, setEndingTime] = useState(
    new Date(Date.now() + 4 * 60 * 60 * 1000),
  );
  const [format, setFormat] = useState<GameFormat>("3v3");
  const [competitiveness, setCompetitiveness] =
    useState<Competitiveness>("casual");
  const [visibility, setVisibility] = useState<GameVisibility>("public");
  const [invitedFriends, setInvitedFriends] = useState<
    { id: string; name: string }[]
  >([
    { id: "1", name: "Marcus J." },
    { id: "2", name: "Tyler R." },
    { id: "3", name: "Devon W." },
  ]);
  const [friendSearch, setFriendSearch] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onStartTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) setMeetupTime(selectedDate);
  };

  const onEndTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndingTime(selectedDate);
  };

  const removeFriend = (id: string) => {
    setInvitedFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePostGame = async () => {
    setIsSubmitting(true);
    try {
      await createCourtGame({
        courtServerId,
        courtDescriptor: courtDescriptor || undefined,
        meetupTime,
        endingTime,
        format,
        visibility,
        competitiveness,
        description,
      });

      Alert.alert("Success", "Game posted successfully!");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Could not post game. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Game</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.formContainer}>
          {/* Section: Court Descriptor */}
          <Text style={styles.sectionLabel}>Court</Text>
          <TextInput
            style={styles.courtInput}
            placeholder="Insert identifying information of the specific court (i.e court number or description of location)"
            placeholderTextColor="#666"
            value={courtDescriptor}
            onChangeText={setCourtDescriptor}
          />

          {/* Section: Time */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Time</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>START</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(meetupTime)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>END</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  {formatTime(endingTime)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={meetupTime}
              mode="time"
              display="spinner"
              onChange={onStartTimeChange}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endingTime}
              mode="time"
              display="spinner"
              onChange={onEndTimeChange}
            />
          )}

          {/* Section: Type */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Type</Text>
          <View style={styles.row}>
            {["1v1", "2v2", "3v3", "4v4", "5v5", "open"].map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.pill, format === f && styles.pillActive]}
                onPress={() => setFormat(f as GameFormat)}
              >
                <Text
                  style={[
                    styles.pillText,
                    format === f && styles.pillTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section: Difficulty & Visibility Row */}
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.sectionLabel}>Difficulty</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    competitiveness === "casual" && styles.pillActive,
                  ]}
                  onPress={() => setCompetitiveness("casual")}
                >
                  <Text
                    style={[
                      styles.pillText,
                      competitiveness === "casual" && styles.pillTextActive,
                    ]}
                  >
                    Casual
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    competitiveness === "competitive" && styles.pillActive,
                  ]}
                  onPress={() => setCompetitiveness("competitive")}
                >
                  <Text
                    style={[
                      styles.pillText,
                      competitiveness === "competitive" &&
                        styles.pillTextActive,
                    ]}
                  >
                    Comp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={styles.sectionLabel}>Visibility</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    visibility === "public" && styles.pillActive,
                  ]}
                  onPress={() => setVisibility("public")}
                >
                  <Text
                    style={[
                      styles.pillText,
                      visibility === "public" && styles.pillTextActive,
                    ]}
                  >
                    Public
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    visibility === "private" && styles.pillActive,
                  ]}
                  onPress={() => setVisibility("private")}
                >
                  <Text
                    style={[
                      styles.pillText,
                      visibility === "private" && styles.pillTextActive,
                    ]}
                  >
                    Private
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Section: Invite Friends */}
          <View style={styles.inviteHeader}>
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
              Invite Friends
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends by name..."
            placeholderTextColor="#666"
            value={friendSearch}
            onChangeText={setFriendSearch}
          />
          {invitedFriends.length > 0 && (
            <View style={styles.chipRow}>
              {invitedFriends.map((friend) => (
                <View key={friend.id} style={styles.chip}>
                  <Text style={styles.chipText}>{friend.name}</Text>
                  <TouchableOpacity onPress={() => removeFriend(friend.id)}>
                    <Text style={styles.chipRemove}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Section: Description */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Description
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Add game details, rules, or requirements..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </ScrollView>

        {/* Footer / Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handlePostGame}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitButtonText}>Post Game</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A1A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#1A1A1A",
  },
  closeText: { color: "#E68A2E", fontSize: 16 },
  title: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  formContainer: { flex: 1, padding: 20 },
  sectionLabel: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  courtInput: {
    backgroundColor: "#2A2A2A",
    color: "#FFF",
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 1,
  },
  timeButton: {
    backgroundColor: "#2A2A2A",
    borderRadius: 15,
    padding: 14,
    alignItems: "center",
  },
  timeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 25,
    padding: 4,
  },
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
  pillActive: { backgroundColor: "#E68A2E" },
  pillText: { color: "#888", fontWeight: "600" },
  pillTextActive: { color: "#FFF" },
  openButton: {
    marginTop: 16,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 25,
    padding: 14,
    alignItems: "center",
  },
  openButtonActive: {
    backgroundColor: "#333",
    borderColor: "#FFF",
  },
  openButtonText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
  },
  openButtonTextActive: {
    color: "#FFF",
  },
  inviteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: {
    color: "#E68A2E",
    fontSize: 14,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: "#2A2A2A",
    color: "#FFF",
    borderRadius: 15,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 8,
  },
  chipText: {
    color: "#FFF",
    fontSize: 13,
  },
  chipRemove: {
    color: "#888",
    fontSize: 14,
  },
  textInput: {
    backgroundColor: "#2A2A2A",
    color: "#FFF",
    borderRadius: 15,
    padding: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  footer: { padding: 20, paddingBottom: 40, backgroundColor: "#1A1A1A" },
  submitButton: {
    backgroundColor: "#E68A2E",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  submitButtonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
});
