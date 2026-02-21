import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCourtContext } from "../../context/CourtContext";
import { CourtDocument } from "../../types/CourtServerTypes";

interface InfoRowProps {
  icon: any;
  iconColor: string;
  label: string;
  children: React.ReactNode;
}

const InfoRowWrapper = ({ icon, iconColor, label, children }: InfoRowProps) => (
  <View style={styles.rowContainer}>
    {/* Left Icon Box */}
    <View style={styles.iconBox}>{icon}</View>

    {/* Right Content */}
    <View style={styles.contentBox}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  </View>
);

/** 📍 ADDRESS COMPONENT */
const AddressRow = ({ court }: { court: CourtDocument }) => {
  const handleGetDirections = () => {
    const scheme = Platform.select({ ios: "maps:", android: "geo:" });
    const latLng = `${court.location.latitude},${court.location.longitude}`;
    const label = court.name;
    const url = Platform.select({
      ios: `${scheme}?q=${label}&ll=${latLng}`,
      android: `${scheme}0,0?q=${latLng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <InfoRowWrapper
      label="ADDRESS"
      iconColor="#F43F5E"
      icon={<Ionicons name="location" size={24} color="#F43F5E" />}
    >
      <Text style={styles.mainText}>{court.address}</Text>
      <TouchableOpacity
        style={styles.directionBtn}
        onPress={handleGetDirections}
      >
        <Ionicons
          name="navigate"
          size={12}
          color="white"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.directionBtnText}>GET DIRECTIONS</Text>
      </TouchableOpacity>
    </InfoRowWrapper>
  );
};

/** 🕒 OPENING TIMES COMPONENT */
const OpeningTimesRow = ({ court }: { court: CourtDocument }) => {
  const isOpen = court.is_open_now;

  const getTodayHours = () => {
    if (!court.opening_hours || court.opening_hours.length === 0) {
      return "Hours not available";
    }
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = days[new Date().getDay()];
    const todayString = court.opening_hours.find((timeStr) =>
      timeStr.startsWith(todayName),
    );

    if (todayString) {
      const parts = todayString.split(": ");
      return parts.length > 1 ? parts.slice(1).join(": ") : todayString;
    }

    return "Hours not available";
  };

  return (
    <InfoRowWrapper
      label="OPENING TIMES"
      iconColor="#10B981"
      icon={<Ionicons name="time" size={24} color="#10B981" />}
    >
      <View style={styles.flexRow}>
        <View style={[styles.pill, isOpen ? styles.pillGreen : styles.pillRed]}>
          <Text style={styles.pillText}>{isOpen ? "OPEN NOW" : "CLOSED"}</Text>
        </View>
      </View>

      {/* Renders the extracted time (e.g., "6:00 AM - 11:00 PM") */}
      <Text style={styles.mainText}>{getTodayHours()}</Text>
    </InfoRowWrapper>
  );
};

/** ⭐ RATING COMPONENT */
const RatingRow = ({ court }: { court: CourtDocument }) => (
  <InfoRowWrapper
    label="RATING"
    iconColor="#FBBF24"
    icon={<Ionicons name="star" size={24} color="#FBBF24" />}
  >
    <View style={styles.flexRow}>
      <Text style={styles.ratingBig}>{court.rating_google || "N/A"}</Text>
      <View style={{ marginLeft: 8 }}>
        <View style={{ flexDirection: "row" }}>
          {/* Simple Star Visual */}
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={
                i < Math.round(court.rating_google) ? "star" : "star-outline"
              }
              size={14}
              color="#FBBF24"
            />
          ))}
        </View>
        <Text style={styles.subText}>
          ({court.total_ratings_google} reviews)
        </Text>
      </View>
    </View>
  </InfoRowWrapper>
);

/** 🏀 COURT COUNT COMPONENT */
const CourtCountRow = ({ court }: { court: CourtDocument }) => (
  <InfoRowWrapper
    label="COURTS"
    iconColor="#F97316"
    icon={
      <MaterialCommunityIcons name="basketball" size={24} color="#F97316" />
    }
  >
    <Text style={styles.mainText}>{court.court_count || 1} Full Courts</Text>
  </InfoRowWrapper>
);

/** 👥 LIVE COUNT COMPONENT */
const LiveCountRow = ({ court }: { court: CourtDocument }) => (
  <InfoRowWrapper
    label="LIVE COUNT"
    iconColor="#A855F7"
    icon={<Ionicons name="people" size={24} color="#A855F7" />}
  >
    <View style={styles.flexRow}>
      <View style={styles.liveDot} />
      <Text style={styles.mainText}>
        {court.active_player_count} Players active
      </Text>
    </View>
  </InfoRowWrapper>
);

/** 🏠 COURT TYPE COMPONENT */
const CourtTypeRow = ({ court }: { court: CourtDocument }) => (
  <InfoRowWrapper
    label="COURT TYPE"
    iconColor="#3B82F6"
    icon={<MaterialCommunityIcons name="home-city" size={24} color="#3B82F6" />}
  >
    <Text style={styles.mainText}>
      {court.court_type
        ? court.court_type.charAt(0).toUpperCase() + court.court_type.slice(1)
        : "Unknown"}
    </Text>
  </InfoRowWrapper>
);

/** 🧱 SURFACE TYPE COMPONENT */
const SurfaceRow = ({ court }: { court: CourtDocument }) => (
  <InfoRowWrapper
    label="SURFACE TYPE"
    iconColor="#64748B"
    icon={<MaterialCommunityIcons name="grid" size={24} color="#64748B" />}
  >
    <Text style={styles.mainText}>
      {court.surface !== "unknown" ? court.surface : "Not specified"}
    </Text>
    <Text style={styles.subText}>Unknown</Text>
  </InfoRowWrapper>
);

/** ⚡ LIGHTING COMPONENT */
const LightingRow = ({ court }: { court: CourtDocument }) => (
  <InfoRowWrapper
    label="LIGHTING"
    iconColor="#FACC15"
    icon={<Ionicons name="bulb" size={24} color="#FACC15" />}
  >
    <Text style={styles.mainText}>
      {court.lighting !== "none" ? "Lighted until 11:00 PM" : "No Lighting"}
    </Text>
  </InfoRowWrapper>
);

const TabInfoContent = () => {
  const { activeCourt } = useCourtContext();

  if (!activeCourt) return null;

  return (
    <View style={styles.container}>
      {/* Simply stack the components in order */}
      <AddressRow court={activeCourt} />
      <View style={styles.divider} />

      <OpeningTimesRow court={activeCourt} />
      <View style={styles.divider} />

      <RatingRow court={activeCourt} />
      <View style={styles.divider} />

      <CourtCountRow court={activeCourt} />
      <View style={styles.divider} />

      <LiveCountRow court={activeCourt} />
      <View style={styles.divider} />

      <CourtTypeRow court={activeCourt} />
      <View style={styles.divider} />

      <SurfaceRow court={activeCourt} />
      <View style={styles.divider} />

      <LightingRow court={activeCourt} />
    </View>
  );
};

export default TabInfoContent;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 40,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1c1c1e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contentBox: {
    flex: 1,
    paddingTop: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6b7280",
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  mainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  divider: {
    height: 1,
    backgroundColor: "#27272a",
    marginLeft: 64,
  },
  directionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27272a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  directionBtnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  pillGreen: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  pillRed: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  pillText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#34D399",
  },
  ratingBig: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 8,
  },
});
