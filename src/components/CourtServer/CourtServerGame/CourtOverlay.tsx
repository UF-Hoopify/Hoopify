import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CourtServerGame } from "../../../types/CourtServerTypes";
import { formatTime } from "./courtGameDetailsHelpers";

interface CourtOverlayProps {
  game: CourtServerGame;
}

const COURT_LINE = "#E68A2E";
const COURT_LINE_W = 1;

const CourtOverlay = ({ game }: CourtOverlayProps) => (
  <View style={styles.courtOverlayContainer}>
    <View style={styles.courtOverlayInner}>
      <View style={styles.courtMock}>
        <View style={styles.courtCenterLine} />
        <View style={styles.courtCenterCircle} />
        <View style={[styles.courtThreePoint, styles.courtThreePointLeft]} />
        <View style={[styles.courtThreePoint, styles.courtThreePointRight]} />
        <View style={[styles.courtPaint, styles.courtPaintLeft]} />
        <View style={[styles.courtPaint, styles.courtPaintRight]} />
      </View>

      {/* Info banner at top */}
      <View style={styles.courtInfoBanner}>
        <Text style={styles.courtInfoLabel}>TIME & VENUE</Text>
        <View style={styles.courtInfoRow}>
          <View style={styles.clockDot} />
          <Text style={styles.courtInfoTime}>
            {formatTime(game.meetupTime)}
          </Text>
        </View>
      </View>

      {/* Footer pills */}
      <View style={styles.courtFooter}>
        <View style={styles.courtPillRow}>
          <View style={styles.courtPill}>
            <Text style={styles.courtPillText}>
              {game.competitiveness === "casual" ? "Casual" : "Comp"}
            </Text>
          </View>
          <View style={styles.courtPill}>
            <Text style={styles.courtPillText}>
              {game.visibility === "public" ? "open" : "private"}
            </Text>
          </View>
        </View>
        <View style={styles.courtArrowButton}>
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  courtOverlayContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  courtOverlayInner: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  courtMock: {
    height: 180,
    marginHorizontal: 12,
    marginTop: 50,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#161616",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
    position: "relative",
  },
  courtCenterLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: COURT_LINE_W,
    backgroundColor: COURT_LINE,
    marginLeft: -COURT_LINE_W / 2,
  },
  courtCenterCircle: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
    backgroundColor: "#161616",
    marginTop: -22,
    marginLeft: -22,
  },
  courtThreePoint: {
    position: "absolute",
    top: "6%",
    bottom: "6%",
    width: "36%",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
  },
  courtThreePointLeft: {
    left: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 1000,
    borderBottomRightRadius: 1000,
  },
  courtThreePointRight: {
    right: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 1000,
    borderBottomLeftRadius: 1000,
  },
  courtPaint: {
    position: "absolute",
    top: "32%",
    bottom: "32%",
    width: "19%",
    borderWidth: COURT_LINE_W,
    borderColor: COURT_LINE,
  },
  courtPaintLeft: { left: 0, borderLeftWidth: 0 },
  courtPaintRight: { right: 0, borderRightWidth: 0 },
  courtInfoBanner: {
    position: "absolute",
    top: 14,
    left: 16,
  },
  courtInfoLabel: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  courtInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E68A2E",
    marginRight: 8,
  },
  courtInfoTime: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  courtFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  courtPillRow: { flexDirection: "row", gap: 8 },
  courtPill: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  courtPillText: { color: "#AAA", fontSize: 12, fontWeight: "600" },
  courtArrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E68A2E",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CourtOverlay;
