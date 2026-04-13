import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TabCarouselProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
  onPlusPress?: () => void;
}

export const TabCarousel = ({
  tabs,
  activeTab,
  onTabPress,
  onPlusPress,
}: TabCarouselProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.tabBarBackground}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabItem, isActive && styles.activeTabItem]}
                  onPress={() => onTabPress(tab)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {onPlusPress && (
          <TouchableOpacity
            style={styles.plusButton}
            onPress={onPlusPress}
            activeOpacity={0.7}
          >
            <Text style={styles.plusButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  scrollContent: {},
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E68A2E",
    justifyContent: "center",
    alignItems: "center",
  },
  plusButtonText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: -1,
  },
  tabBarBackground: {
    flexDirection: "row",
    backgroundColor: "#1c1c1e",
    borderRadius: 25,
    padding: 4,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTabItem: {
    backgroundColor: "#F97316",
  },
  tabText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
