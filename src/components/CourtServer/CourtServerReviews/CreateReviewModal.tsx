import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addReview } from "../../../services/ReviewService";

interface CreateReviewModalProps {
  visible: boolean;
  onClose: () => void;
  courtId: string;
  onReviewCreated: () => void;
}

export const CreateReviewModal = ({
  visible,
  onClose,
  courtId,
  onReviewCreated,
}: CreateReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setRating(0);
    setText("");
    setImages([]);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a star rating.");
      return;
    }
    if (!text.trim()) {
      Alert.alert("Review Required", "Please write a review.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(courtId, rating, text.trim(), images);
      Alert.alert("Success", "Your review has been posted!");
      resetForm();
      onReviewCreated();
      onClose();
    } catch {
      Alert.alert("Error", "Could not post review. Please try again.");
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
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Write a Review</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.formContainer}>
          {/* Star Rating */}
          <Text style={styles.sectionLabel}>Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={36}
                  color="#F97316"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Text */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Your Review
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Share your experience at this court..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={6}
            value={text}
            onChangeText={setText}
          />

          {/* Image Picker */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Photos ({images.length}/5)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageRow}
          >
            {images.map((uri, index) => (
              <View key={index} style={styles.imagePreviewWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={22} color="#FF4444" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
                <Ionicons name="camera-outline" size={28} color="#888" />
                <Text style={styles.addImageText}>Add</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </ScrollView>

        {/* Submit */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || !text.trim()) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || rating === 0 || !text.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitButtonText}>Post Review</Text>
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
  cancelText: { color: "#E68A2E", fontSize: 16 },
  title: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  formContainer: { flex: 1, padding: 20 },
  sectionLabel: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    backgroundColor: "#2A2A2A",
    color: "#FFF",
    borderRadius: 15,
    padding: 15,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 14,
  },
  imageRow: {
    gap: 10,
    paddingBottom: 20,
  },
  imagePreviewWrapper: {
    position: "relative",
  },
  imagePreview: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#1A1A1A",
    borderRadius: 11,
  },
  addImageButton: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#444",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  footer: { padding: 20, paddingBottom: 40, backgroundColor: "#1A1A1A" },
  submitButton: {
    backgroundColor: "#E68A2E",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
});
