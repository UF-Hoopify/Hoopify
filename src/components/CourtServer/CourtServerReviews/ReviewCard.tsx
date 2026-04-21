import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../../config/firebaseConfig";
import { toggleLike } from "../../../services/ReviewService";
import { ReviewDocument } from "../../../types/CourtServerTypes";

interface ReviewCardProps {
  review: ReviewDocument;
  courtId: string;
  onImagePress: (imageUrls: string[], startIndex: number) => void;
}

const getTimeAgo = (timestamp: { toDate: () => Date }): string => {
  if (!timestamp?.toDate) return "";
  const seconds = Math.floor(
    (Date.now() - timestamp.toDate().getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

export const ReviewCard = ({
  review,
  courtId,
  onImagePress,
}: ReviewCardProps) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [liked, setLiked] = useState(
    review.likedBy?.includes(auth.currentUser?.uid || "") ?? false,
  );
  const [likesCount, setLikesCount] = useState(review.likesCount || 0);

  const handleToggleLike = async () => {
    const wasLiked = liked;
    // Optimistic update
    setLiked(!wasLiked);
    setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

    try {
      await toggleLike(courtId, review.id);
    } catch {
      // Revert on failure
      setLiked(wasLiked);
      setLikesCount((prev) => prev + (wasLiked ? 1 : -1));
    }
  };

  const shouldTruncate = review.text.length > 200;
  const displayText =
    shouldTruncate && !isTextExpanded
      ? review.text.slice(0, 200) + "..."
      : review.text;

  return (
    <View style={styles.card}>
      {/* Header: Avatar + Name + Time */}
      <View style={styles.header}>
        {review.userProfilePic ? (
          <Image
            source={{ uri: review.userProfilePic }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={20} color="#888" />
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{review.userName}</Text>
          <Text style={styles.timeAgo}>{getTimeAgo(review.createdAt)}</Text>
        </View>
      </View>

      {/* Star Rating */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= review.rating ? "star" : "star-outline"}
            size={16}
            color="#F97316"
          />
        ))}
      </View>

      {/* Review Text */}
      <Text style={styles.reviewText}>{displayText}</Text>
      {shouldTruncate && (
        <TouchableOpacity onPress={() => setIsTextExpanded(!isTextExpanded)}>
          <Text style={styles.readMore}>
            {isTextExpanded ? "Show Less" : "Read More"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Image Strip */}
      {review.imageUrls && review.imageUrls.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageStrip}
          contentContainerStyle={styles.imageStripContent}
        >
          {review.imageUrls.map((url, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onImagePress(review.imageUrls, index)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: url }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Like Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleToggleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color={liked ? "#F97316" : "#888"}
          />
          <Text style={[styles.likesCount, liked && styles.likesCountActive]}>
            {likesCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  timeAgo: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 2,
  },
  reviewText: {
    color: "#CCC",
    fontSize: 13,
    lineHeight: 20,
  },
  readMore: {
    color: "#F97316",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  imageStrip: {
    marginTop: 12,
  },
  imageStripContent: {
    gap: 8,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#333",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likesCount: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  likesCountActive: {
    color: "#F97316",
  },
});
