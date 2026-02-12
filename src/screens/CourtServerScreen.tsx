import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// --- MOCK DATA FOR UI DEVELOPMENT ---
const MOCK_COURT_DATA = {
  id: "1",
  name: "Flavet Field",
  address: "Woodlawn Dr, Gainesville, FL 32603",
  distance: "0.2 mi",
  rating: 4.8,
  reviews: 124,
  photos: [
    "https://www.cityofrochester.gov/sites/default/files/styles/wide/public/2025-03/101123COMM%20Jackson%20R-Center%20BB%20Court%20Ribbon%20Cutting_drone-0977.jpg?itok=9WUaQOfg",
    "https://media.istockphoto.com/id/1551914538/photo/basketball-court-on-3d-illustration.jpg?s=612x612&w=0&k=20&c=zbzckGLILsJvqdvWsS6N0RQn8Z9i6n1iTN4VtSOCWHc=",
  ],
  isOpen: true,
  hours: "6:00 AM - 11:00 PM",
  surface: "Asphalt",
  surfaceDetail: "Good condition, recent resurfacing",
  lighting: "Lighted until 11:00 PM",
};

// --- TYPES ---
type TabOption = "Games" | "Info" | "Chat";

export const CourtServerScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<TabOption>("Info");
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // --- RENDER HELPERS ---

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.ceil(
            e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width,
          );
          if (slide !== activeImgIndex) setActiveImgIndex(slide);
        }}
        scrollEventThrottle={16}
      >
        {MOCK_COURT_DATA.photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.headerImage}
          />
        ))}
      </ScrollView>

      {/* Top Action Bar (Back, Share, Heart) */}
      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconBtnBlur}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity style={styles.iconBtnBlur}>
              <Ionicons name="share-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtnBlur}>
              <Ionicons name="heart-outline" size={24} color="#F97316" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Image Overlay Content (Title, Rating) */}
      <View style={styles.imageOverlay}>
        <View>
          <Text style={styles.courtTitle}>{MOCK_COURT_DATA.name}</Text>
          <Text style={styles.courtSubtitle}>
            {MOCK_COURT_DATA.address.split(",")[0]} • {MOCK_COURT_DATA.distance}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FFF" />
          <Text style={styles.ratingText}>{MOCK_COURT_DATA.rating}</Text>
        </View>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {MOCK_COURT_DATA.photos.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeImgIndex ? styles.activeDot : null]}
          />
        ))}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {(["Games", "Info", "Chat"] as TabOption[]).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, isActive && styles.activeTabBtn]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.infoContent}>
      {/* Address Card */}
      <View style={styles.infoRow}>
        <View style={styles.iconBox}>
          <Ionicons name="location" size={24} color="#FF5A5F" />
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.sectionLabel}>ADDRESS</Text>
          <Text style={styles.infoValue}>{MOCK_COURT_DATA.address}</Text>
          <TouchableOpacity style={styles.directionsBtn}>
            <Ionicons name="navigate" size={16} color="#FFF" />
            <Text style={styles.directionsText}>GET DIRECTIONS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Hours Card */}
      <View style={styles.infoRow}>
        <View style={styles.iconBox}>
          <Ionicons name="time" size={24} color="#22c55e" />
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.sectionLabel}>OPENING TIMES</Text>
          <View style={styles.statusRow}>
            {MOCK_COURT_DATA.isOpen && (
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>OPEN NOW</Text>
              </View>
            )}
          </View>
          <Text style={styles.infoValue}>{MOCK_COURT_DATA.hours}</Text>
          <Text style={styles.subDetailText}>{MOCK_COURT_DATA.lighting}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Surface Card */}
      <View style={styles.infoRow}>
        <View style={styles.iconBox}>
          <Ionicons name="grid" size={24} color="#3b82f6" />
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.sectionLabel}>SURFACE TYPE</Text>
          <Text style={styles.infoValue}>{MOCK_COURT_DATA.surface}</Text>
          <Text style={styles.subDetailText}>
            {MOCK_COURT_DATA.surfaceDetail}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPlaceholderTab = (name: string) => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="construct-outline" size={48} color="#333" />
      <Text style={styles.placeholderText}>{name} coming soon</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Upper Half: Image Header */}
      {renderHeader()}

      {/* Lower Half: Bottom Sheet Content */}
      <View style={styles.sheetContainer}>
        {renderTabs()}

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "Info" && renderInfoTab()}
          {activeTab === "Games" && renderPlaceholderTab("Games")}
          {activeTab === "Chat" && renderPlaceholderTab("Chat")}

          {/* Bottom Padding for scroll */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  // --- HEADER STYLES ---
  headerContainer: {
    height: height * 0.45, // Takes up top 45% of screen
    width: width,
    position: "relative",
  },
  headerImage: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  topSafeArea: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  iconBtnBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)", // Semi-transparent blur effect
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)", // Works on some versions, ignored on others
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingBottom: 40, // Space for the rounded sheet to overlap slightly
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "linear-gradient(transparent, rgba(0,0,0,0.8))", // Pseudo-code concept
  },
  courtTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  courtSubtitle: {
    color: "#DDD",
    fontSize: 14,
    fontWeight: "500",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: "#FFF",
    fontWeight: "700",
  },
  pagination: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  activeDot: {
    backgroundColor: "#F97316",
    width: 16,
  },

  // --- SHEET / CONTENT STYLES ---
  sheetContainer: {
    flex: 1,
    marginTop: -24, // Negative margin to pull sheet up over image
    backgroundColor: "#000",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#1C1C1E",
    alignSelf: "center",
    borderRadius: 30,
    padding: 4,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  activeTabBtn: {
    backgroundColor: "#F97316",
  },
  tabText: {
    color: "#888",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // --- INFO TAB STYLES ---
  infoContent: {
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoTextCol: {
    flex: 1,
    justifyContent: "center",
  },
  sectionLabel: {
    color: "#666",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 22,
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  directionsText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#1C1C1E",
    marginBottom: 24,
    marginLeft: 64, // Indent to align with text
  },
  statusRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  openBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  openBadgeText: {
    color: "#22c55e",
    fontSize: 10,
    fontWeight: "700",
  },
  subDetailText: {
    color: "#888",
    fontSize: 13,
  },

  // --- PLACEHOLDER ---
  placeholderContainer: {
    alignItems: "center",
    marginTop: 60,
    opacity: 0.5,
  },
  placeholderText: {
    color: "#555",
    marginTop: 12,
    fontSize: 16,
  },
});
