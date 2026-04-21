import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import CourtServerGame from "./CourtServerGame/CourtServerGame";
import CourtServerReviews from "./CourtServerReviews/CourtServerReviews";
import { TabCarousel } from "./TabCarousel";
import TabInfoContent from "./TabInfoContent";

const TABS = ["Games", "Info", "Reviews"];

export const CourtServerTab = ({
  courtServerId,
}: {
  courtServerId: string;
}) => {
  const [activeTab, setActiveTab] = useState("Info");
  const [isCreateReviewVisible, setIsCreateReviewVisible] = useState(false);

  const handlePlusPress = () => {
    if (activeTab === "Reviews") {
      setIsCreateReviewVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <TabCarousel
        tabs={TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onPlusPress={activeTab === "Reviews" ? handlePlusPress : undefined}
      />

      <View style={styles.detailsContainer}>
        {activeTab === "Info" && (
          <BottomSheetScrollView
            contentContainerStyle={styles.infoContent}
            showsVerticalScrollIndicator={false}
          >
            <TabInfoContent />
          </BottomSheetScrollView>
        )}
        {activeTab === "Games" && (
          <CourtServerGame courtServerId={courtServerId} />
        )}
        {activeTab === "Reviews" && (
          <CourtServerReviews
            courtServerId={courtServerId}
            isCreateModalVisible={isCreateReviewVisible}
            onCreateModalClose={() => setIsCreateReviewVisible(false)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  detailsContainer: {
    flex: 1,
    width: "100%",
  },
  infoContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
