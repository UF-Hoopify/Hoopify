import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Ensure you have: npx expo install expo-linear-gradient
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMBNAIL_HEIGHT = 400;

interface CourtServerThumbnailProps {
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  photos: string[];
  hideNavigationArrows?: boolean;
}

export const CourtServerThumbnail = ({
  name,
  address,
  rating,
  totalRatings,
  photos,
  hideNavigationArrows = false,
}: CourtServerThumbnailProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const displayPhotos =
    photos.length > 0
      ? photos
      : ["https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < displayPhotos.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- 1. CAROUSEL --- */}
      <FlatList
        ref={flatListRef}
        data={displayPhotos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />

      {/* --- 2. TOP LAYER (Icons) --- */}
      <View style={styles.topLayer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* --- 3. ARROWS (Visible only if multiple photos) --- */}
      {displayPhotos.length > 1 && !hideNavigationArrows && (
        <>
          {activeIndex > 0 && (
            <TouchableOpacity
              style={[styles.arrowButton, styles.leftArrow]}
              onPress={() => scrollToIndex(activeIndex - 1)}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          {activeIndex < displayPhotos.length - 1 && (
            <TouchableOpacity
              style={[styles.arrowButton, styles.rightArrow]}
              onPress={() => scrollToIndex(activeIndex + 1)}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* --- 4. BOTTOM LAYER (Info + Dots) --- */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.bottomLayer}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address} numberOfLines={1}>
            {address}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F97316" />
            <Text style={styles.ratingText}>
              {rating} ({totalRatings})
            </Text>
          </View>
        </View>

        {/* Pagination Dots */}
        {displayPhotos.length > 1 && (
          <View style={styles.pagination}>
            {displayPhotos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: THUMBNAIL_HEIGHT,
    width: "100%",
    position: "relative",
    backgroundColor: "#eee",
  },
  image: {
    width: SCREEN_WIDTH,
    height: THUMBNAIL_HEIGHT,
  },
  topLayer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  leftArrow: { left: 10 },
  rightArrow: { right: 10 },
  bottomLayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
  },
  infoContainer: {
    marginBottom: 10,
  },
  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  address: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#F97316",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 14,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#F97316",
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
