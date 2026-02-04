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

const CARD_HEIGHT = 280;
const IMAGE_HEIGHT = 180;
const stockCourtImg =
  "https://media.istockphoto.com/id/1551914538/photo/basketball-court-on-3d-illustration.jpg?s=612x612&w=0&k=20&c=zbzckGLILsJvqdvWsS6N0RQn8Z9i6n1iTN4VtSOCWHc=";
interface CourtListingProps {
  court: Court;
  userLocation?: { lat: number; lng: number };
  onPress: () => void;
}

export const CourtListing: React.FC<CourtListingProps> = ({
  court,
  userLocation,
  onPress,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const images =
    court.photos && court.photos.length > 0 ? court.photos : [stockCourtImg];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveSlide(Math.round(index));
  };

  const getDistance = () => {
    if (!userLocation) return "Nearby";
    return "1.2 mi away";
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardContainer}
    >
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

        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.pagination}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeSlide ? styles.activeDot : null]}
            />
          ))}
        </View>
      </View>

      <View style={styles.infoContainer}>
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

        <Text style={styles.addressText} numberOfLines={1}>
          {court.address}
        </Text>

        <View style={[styles.rowBetween, { marginTop: 12 }]}>
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

          <View style={styles.distanceRow}>
            <Text style={styles.distanceText}>{getDistance()}</Text>
            <Ionicons name="chevron-forward" size={14} color="#666" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    height: CARD_HEIGHT,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  scrollView: { flex: 1 },
  image: {
    width: width - 32,
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
    color: "#a1a1aa",
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
