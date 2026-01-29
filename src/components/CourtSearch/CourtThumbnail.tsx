import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { CourtDetails } from "../../types/CourtSearchTypes";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;
const CAROUSEL_HEIGHT = 220;

interface CourtSearchThumbnailProps {
  court: CourtDetails;
  formattedDistance?: string;
  onClose: () => void;
  onPinPress?: () => void;
  isLoadingDetails?: boolean;
}

export const CourtSearchThumbnail: React.FC<CourtSearchThumbnailProps> = ({
  court,
  formattedDistance = "Nearby",
  onClose,
  onPinPress,
  isLoadingDetails = false,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const placeholderImages = [
    "https://images.unsplash.com/photo-1546519638-68e109498ee2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519861531473-920026393112?q=80&w=1000&auto=format&fit=crop",
  ];

  const imagesToDisplay =
    court.photos && court.photos.length > 0 ? court.photos : placeholderImages;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {imagesToDisplay.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.image} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Elite Court</Text>
          {/*TODO: Dynamic Badge*/}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.circleBtn} onPress={onPinPress}>
            <Ionicons name="location" size={18} color="#1e1e1e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color="#1e1e1e" />
          </TouchableOpacity>
        </View>

        <View style={styles.liveOverlay}>
          <View
            style={[
              styles.liveDot,
              { backgroundColor: court.available > 0 ? "#22c55e" : "#ef4444" },
            ]}
          />
          <Text style={styles.liveText}>
            {court.available > 0 ? `${court.available} Live` : "Quiet"}
          </Text>
        </View>

        <View style={styles.pagination}>
          {imagesToDisplay.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeImageIndex ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.metaContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.courtName} numberOfLines={1}>
            {court.name}
          </Text>

          <View style={styles.ratingContainer}>
            {isLoadingDetails ? (
              <ActivityIndicator size="small" color="#F97316" />
            ) : (
              <>
                <Ionicons name="star" size={14} color="#F97316" />
                <Text style={styles.ratingText}>
                  {court.rating ? court.rating.toFixed(1) : "N/A"}
                  <Text style={styles.ratingCount}>
                    {" "}
                    ({court.totalRatings || 0})
                  </Text>
                </Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.subText}>
          {formattedDistance} • {court.address.split(",")[0]}
        </Text>

        <View style={styles.widgetsRow}>
          {["3v3", "5v5", "Lights", "Outdoor"].map((tag, i) => (
            <View key={i} style={styles.widgetTag}>
              <Text style={styles.widgetText}>{tag}</Text>
            </View>
          ))}

          {court.closingTime && (
            <View style={[styles.widgetTag, styles.alertTag]}>
              <Text style={[styles.widgetText, styles.alertText]}>
                {court.closingTime}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    overflow: "hidden",
  },

  carouselContainer: {
    position: "relative",
    height: CAROUSEL_HEIGHT,
  },
  carousel: {
    flex: 1,
  },
  imageWrapper: {
    width: CARD_WIDTH,
    height: CAROUSEL_HEIGHT,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  badgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionButtons: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  circleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: 8,
  },
  liveOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  pagination: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    backgroundColor: "#FFF",
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  metaContainer: {
    padding: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  courtName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginLeft: 4,
  },
  ratingCount: {
    color: "#666",
    fontWeight: "400",
    fontSize: 12,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },

  widgetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  widgetTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  widgetText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },
  alertTag: {
    backgroundColor: "#FEF2F2",
  },
  alertText: {
    color: "#EF4444",
  },
});
