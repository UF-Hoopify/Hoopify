import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PlayerStatus } from "../../../types/CourtServerTypes";

const OPTIONS: { label: string; value: PlayerStatus }[] = [
  { label: "Ready", value: "confirmed" },
  { label: "Maybe", value: "pending" },
  { label: "Out", value: "declined" },
];

const ITEM_HEIGHT = 48;

interface StatusPickerModalProps {
  visible: boolean;
  currentStatus: PlayerStatus;
  onSelect: (status: PlayerStatus) => void;
  onClose: () => void;
}

const StatusPickerModal = ({
  visible,
  currentStatus,
  onSelect,
  onClose,
}: StatusPickerModalProps) => {
  const initialIndex = OPTIONS.findIndex((o) => o.value === currentStatus);
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  );
  const scrollRef = useRef<ScrollView>(null);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    setSelectedIndex(Math.max(0, Math.min(index, OPTIONS.length - 1)));
  };

  const handleConfirm = () => {
    onSelect(OPTIONS[selectedIndex].value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop — tapping here closes the modal */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Sheet — sits above the backdrop, no gesture conflict */}
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Change Status</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            {/* Highlight band */}
            <View style={styles.highlight} pointerEvents="none" />

            <ScrollView
              ref={scrollRef}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingVertical: ITEM_HEIGHT,
              }}
              contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
              onMomentumScrollEnd={handleMomentumEnd}
            >
              {OPTIONS.map((option, index) => (
                <View key={option.value} style={styles.optionRow}>
                  <Text
                    style={[
                      styles.optionText,
                      index === selectedIndex && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  cancelText: {
    color: "#888",
    fontSize: 16,
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  doneText: {
    color: "#E68A2E",
    fontSize: 16,
    fontWeight: "700",
  },
  pickerContainer: {
    height: ITEM_HEIGHT * 3,
    overflow: "hidden",
    position: "relative",
  },
  highlight: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 16,
    right: 16,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  optionRow: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    color: "#666",
    fontSize: 20,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#FFF",
  },
});

export default StatusPickerModal;
