import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Court } from "../../types/CourtSearchTypes";

const { width } = Dimensions.get("window");
// Card height logic: Fixed height for consistency
const CARD_HEIGHT = 280;
const IMAGE_HEIGHT = 180;
const defaultCourtImg = require("../../../assets/images/basketball-game-concept.jpg");

interface CourtListingProps {
  court: Court;
  userLocation?: { lat: number; lng: number }; // Optional: To calculate "0.2 mi"
  onPress: () => void;
}

export const CourtListing: React.FC<CourtListingProps> = ({
  court,
  userLocation,
  onPress,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const images =
    court.photos && court.photos.length > 0 ? court.photos : [defaultCourtImg]; // Local images are used directly

  // 2. Carousel Logic
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveSlide(Math.round(index));
  };

  // 3. Distance Helper (Placeholder logic if userLocation is missing)
  const getDistance = () => {
    if (!userLocation) return "Nearby";
    // Simple placeholder. In real app, use Haversine formula here.
    return "1.2 mi away";
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardContainer}
    >
      {/* --- SECTION 1: IMAGE CAROUSEL --- */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>

        {/* Heart Icon Overlay */}
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeSlide ? styles.activeDot : null]}
            />
          ))}
        </View>
      </View>

      {/* --- SECTION 2: METADATA --- */}
      <View style={styles.infoContainer}>
        {/* Row A: Name & Rating */}
        <View style={styles.rowBetween}>
          <Text style={styles.courtName} numberOfLines={1}>
            {court.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F97316" />
            <Text style={styles.ratingText}>
              {court.rating ? court.rating.toFixed(1) : "N/A"}
            </Text>
          </View>
        </View>

        {/* Row B: Address */}
        <Text style={styles.addressText} numberOfLines={1}>
          {court.address}
        </Text>

        {/* Row C: Status Badges & Distance */}
        <View style={[styles.rowBetween, { marginTop: 12 }]}>
          {/* Example Status Badge (You can make this dynamic later) */}
          <View style={[styles.statusBadge, { backgroundColor: "#3f3f46" }]}>
            <Ionicons
              name="time-outline"
              size={12}
              color="#fbbf24"
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: "#fbbf24", fontSize: 10, fontWeight: "700" }}>
              CLOSES SOON
            </Text>
          </View>

          {/* Distance with Arrow */}
          <View style={styles.distanceRow}>
            <Text style={styles.distanceText}>{getDistance()}</Text>
            <Ionicons name="chevron-forward" size={14} color="#666" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Styles matching your dark theme screenshot
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1c1c1e", // Dark card background
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20, // Spacing between list items
    height: CARD_HEIGHT,
  },
  // Images
  imageContainer: {
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  scrollView: { flex: 1 },
  image: {
    width: width - 32, // Full width minus list padding
    height: IMAGE_HEIGHT,
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  activeDot: {
    backgroundColor: "#FFF",
  },
  // Info
  infoContainer: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courtName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27272a",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  addressText: {
    color: "#a1a1aa", // Light gray
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    color: "#71717a",
    fontSize: 12,
  },
});
